import {
    ReactNode,
    createContext,
    useRef,
    useState,
  } from 'react'
  import { useToast } from '../ui/use-toast'
  import { useMutation } from '@tanstack/react-query'
  import { trpc } from '@/app/_trpc/client'
  import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query'
  
//can only transfer inputs from parent to child, cannot transfer horizontally
//UNLESS all components are wrapped in a react context, then can transfer horizontally.  

  type StreamResponse = {
    addMessage: () => void
    message: string
    handleInputChange: (
      event: React.ChangeEvent<HTMLTextAreaElement>
    ) => void
    isLoading: boolean
  }
  
  export const ChatContext = createContext<StreamResponse>({
    addMessage: () => {},
    message: '',
    handleInputChange: () => {},
    isLoading: false,
  })
  
  interface Props {
    fileId: string
    children: ReactNode
  }
  
  export const ChatContextProvider = ({
    fileId,
    children,
  }: Props) => {

    //only in this case, dont use trpc, but instead use react query useMutation for the api route. 
    //because we want data to stream back, which doesnt work with trpc as it ends up in json.
    const [message, setMessage] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
  
    const utils = trpc.useContext()
  
    const { toast } = useToast()
  
    const backupMessage = useRef('')
  
    //need a mutation that can send data over to the api endpoint.
    const { mutate: sendMessage } = useMutation({
      mutationFn: async ({
        message,
      }: {
        message: string
      }) => {
        const response = await fetch('/api/message', {
          method: 'POST',
          body: JSON.stringify({
            fileId,
            message,
          }),
        })
  
        if (!response.ok) {
          throw new Error('Failed to send message')
        }
  
        return response.body
      },
      onMutate: async ({ message }) => {
        backupMessage.current = message
        setMessage('')
  
        // step 1
        await utils.getFileMessages.cancel()
  
        // step 2
        const previousMessages =
          utils.getFileMessages.getInfiniteData()
  
        // step 3
        utils.getFileMessages.setInfiniteData(
          { fileId, limit: INFINITE_QUERY_LIMIT },
          (old) => {
            if (!old) {
              return {
                pages: [],
                pageParams: [],
              }
            }
  
            let newPages = [...old.pages]
  
            let latestPage = newPages[0]!
  
            latestPage.messages = [
              {
                createdAt: new Date().toISOString(),
                id: crypto.randomUUID(),
                text: message,
                isUserMessage: true,
              },
              ...latestPage.messages,
            ]
  
            newPages[0] = latestPage
  
            return {
              ...old,
              pages: newPages,
            }
          }
        )
  
        setIsLoading(true)
  
        return {
          previousMessages:
            previousMessages?.pages.flatMap(
              (page) => page.messages
            ) ?? [],
        }
      },
      onSuccess: async (stream) => {
        setIsLoading(false)
  
        if (!stream) {
          return toast({
            title: 'There was a problem sending this message',
            description:
              'Please refresh this page and try again',
            variant: 'destructive',
          })
        }
  
        const reader = stream.getReader()
        const decoder = new TextDecoder()
        let done = false
  
        // accumulated response
        let accResponse = ''
  
        //read the stream
        while (!done) {
          const { value, done: doneReading } =
            await reader.read()
          done = doneReading
          const chunkValue = decoder.decode(value)
  
          accResponse += chunkValue
  
          // append chunk to the actual message
          utils.getFileMessages.setInfiniteData(
            { fileId, limit: INFINITE_QUERY_LIMIT },
            (old) => {
              if (!old) return { pages: [], pageParams: [] }
  
              let isAiResponseCreated = old.pages.some(
                (page) =>
                  page.messages.some(
                    (message) => message.id === 'ai-response'
                  )
              )
  
              let updatedPages = old.pages.map((page) => {
                if (page === old.pages[0]) {
                  let updatedMessages
  
                  if (!isAiResponseCreated) {
                    updatedMessages = [
                      {
                        createdAt: new Date().toISOString(),
                        id: 'ai-response',
                        text: accResponse,
                        isUserMessage: false,
                      },
                      ...page.messages,
                    ]
                  } else {
                    updatedMessages = page.messages.map(
                      (message) => {
                        if (message.id === 'ai-response') {
                          return {
                            ...message,
                            text: accResponse,
                          }
                        }
                        return message
                      }
                    )
                  }
  
                  return {
                    ...page,
                    messages: updatedMessages,
                  }
                }
  
                return page
              })
  
              return { ...old, pages: updatedPages }
            }
          )
        }
      },
  
      onError: (_, __, context) => {
        setMessage(backupMessage.current)
        utils.getFileMessages.setData(
          { fileId },
          { messages: context?.previousMessages ?? [] }
        )
      },
      onSettled: async () => {
        setIsLoading(false)
  
        await utils.getFileMessages.invalidate({ fileId })
      },
    })
  
    const handleInputChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setMessage(e.target.value)
    }
  
    const addMessage = () => sendMessage({ message })
  
    return (
      <ChatContext.Provider
        value={{
          addMessage,
          message,
          handleInputChange,
          isLoading,
        }}>
        {children}
      </ChatContext.Provider>
    )
  }