import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client';

import Avatar from '../assets/avatar.svg'
// import Avatar2 from '../assets/avatar2.svg'
import Avatar3 from '../assets/avatar3.svg'
import Input from '../component/Input'


const Dashboard = () => {

  const [ socket, setSocket ] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState('');
  const [user] = useState(JSON.parse(localStorage.getItem('user:data')))
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const messageRef = useRef(null)

  useEffect (() => {
    setSocket((io('http://localhost:4040')))
  }, [])

  useEffect (() => {
    socket?.emit('addUser', user?.id);
		socket?.on('getUsers', users => {
			console.log('activeUsers :>> ', users);
      setActiveUsers(users);
		})
    socket?.on('getMessage', data => {
			setMessages(prev => ({
				...prev,
				messages: [...prev.messages, { user: data.user, message: data.message }]
			}))
		})
  }, [socket])

  useEffect(() => {
		messageRef?.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages?.messages])

  useEffect(() => {
		const loggedInUser = JSON.parse(localStorage.getItem('user:data'))
		const fetchConversations = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:4000/conversation/${loggedInUser?.id}`);
        setConversations(res.data);
      }catch(e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
		}
		fetchConversations()
	}, [])

  useEffect(() => {
    try {
      const fetchUsers = async () => {
        const res = await axios.get(`http://localhost:4000/users/${user?.id}`);
        setUsers(res.data)
      }
      fetchUsers()
    } catch(e) {
      console.log(e);
    }
	}, [])
  
  const fetchMessages = async (conversationId, receiver) => {
    try{
      setLoader(true)
      const res = await axios.get(`http://localhost:4000/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`);
      console.log(res.data)
      setMessages({ messages: res.data, receiver, conversationId })
    } catch(e) {
      console.log(e);
    } finally {
      setLoader(false);
    }
	}
  
  const sendMessage = async () => {
    
    socket?.emit('sendMessage', {
			senderId: user?.id,
			receiverId: messages?.receiver?.receiverId,
			message,
			conversationId: messages?.conversationId
		});

    await axios.post(`http://localhost:4000/message`, {
      conversationId: messages?.conversationId,
      senderId: user?.id,
      message,
      receiverId: messages?.receiver?.receiverId
		});
    setMessage('')
	}

  return (
    <div className='w-screen flex'>
      { loading ? <div className='w-full h-screen flex justify-center items-center'> Loading... </div> :
      <>
        <div className='w-[25%] h-screen bg-secondary'>
          <div className='flex items-center my-8 mx-14'>
            <img src={Avatar} width={75} height={75} className='border border-primary p-[2px] rounded-full' />
            <div className='ml-4'>
              <h3 className='text-2xl'>{user.fullName}</h3>
              <p className='text-lg font-light'>{user.email}</p>
            </div>
          </div>
          <hr />
          <div className='mx-14 mt-5'>
  					<div className='text-primary text-lg'>Messages</div>
            {
							conversations?.length > 0 ?
								conversations.map(({ conversationId, user }) => {
									return (
										<div className='flex items-center py-8 border-b border-b-gray-300' key={conversationId}>
											<div className='cursor-pointer flex items-center' onClick={() => fetchMessages(conversationId, user)}>
												<div><img src={ Avatar3 } className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary" /></div>
												<div className='ml-6'>
                        <h3 className='text-lg font-semibold flex items-center'>
                          {user?.fullName}
                          <span className={`ml-2 w-3 h-3 rounded-full ${
                            activeUsers.find(({ userId }) => userId === user?.receiverId) ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                        </h3>
													<p className='text-sm font-light text-gray-600'>{user?.email}</p>
												</div>
											</div>
										</div>
									)
								}) : <div className='text-center text-lg font-semibold mt-24'>No Conversations</div>
						}
          </div>
        </div>
        { loader ? <div className='w-[50%] h-screen flex justify-center items-center'> Loading... </div> :
        <> 
          {
            messages?.receiver?.fullName ?
            <div className='w-[50%] h-screen bg-white flex flex-col items-center'>
            <div className='w-[75%] bg-secondary h-[80px] my-14 rounded-full flex items-center px-14 py-2'>
                <div className='cursor-pointer'><img src={Avatar3} width={60} height={60} className="rounded-full" /></div>
                <div className='ml-6 mr-auto'>
                  <h3 className='text-lg font-semibold flex items-center'>
                    {messages?.receiver?.fullName}
                    <span className={`ml-2 w-3 h-3 rounded-full ${
                      activeUsers.find(({ userId }) => userId === messages?.receiver?.receiverId) ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                  </h3>
                  <p className='text-sm font-light text-gray-600'>{messages?.receiver?.email}</p>
                </div>
              </div>
              <div className='h-[75%] w-full overflow-y-scroll shadow-sm'>
               <div className='p-14'>
                  {
                    messages?.messages?.length > 0 ?
                      messages?.messages?.map(({ message, user: { id, realId } = {} }) => {
                        return (
                          <div key={realId}>
                            <div className={`max-w-[40%] rounded-b-xl p-4 mb-6 ${id === user?.id ? 'bg-primary text-white rounded-tl-xl ml-auto' : 'bg-secondary rounded-tr-xl'} `}>{message}</div>
                            <div ref={messageRef}></div>
                          </div>
                        )
                      }) : <div className='text-center text-lg font-semibold mt-24'>No Messages or No Conversation Selected</div>
                  }
                  </div>
                </div>
              <div className='p-14 w-full flex items-center'>
                  <Input placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)} className='w-[75%]' inputClassName='p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none' />
                  <div className={`ml-4 p-2 cursor-pointer bg-light rounded-full`} onClick={() => sendMessage()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-send" width="30" height="30" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                      <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
                    </svg>
                  </div>
                  <div className={`ml-4 p-2 cursor-pointer bg-light rounded-full`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-plus" width="30" height="30" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <circle cx="12" cy="12" r="9" />
                      <line x1="9" y1="12" x2="15" y2="12" />
                      <line x1="12" y1="9" x2="12" y2="15" />
                    </svg>
                  </div>
                </div>
            </div> : <div className='w-[50%] h-screen bg-white flex flex-col items-center text-center text-lg font-semibold mt-24'>No Conversation Selected</div>
          } 
        </> }
        <div className='w-[25%] h-screen bg-secondary'>
          <div className='text-primary text-lg'>People</div>
          <div>
					{
						users.length > 0 ?
							users.map(({ user }) => {
								return (
									<div className='flex items-center py-8 border-b border-b-gray-300' key={user?.receiverId}>
										<div className='cursor-pointer flex items-center' onClick={() => fetchMessages('new', user)}>
											<div><img src={Avatar3} className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary" /></div>
											<div className='ml-6'>
												<h3 className='text-lg font-semibold'>{user?.fullName}</h3>
												<p className='text-sm font-light text-gray-600'>{user?.email}</p>
											</div>
										</div>
									</div>
								)
							}) : <div className='text-center text-lg font-semibold mt-24'>No Conversations</div>
					}
				</div>
        </div> 
      </> }
    </div>
  )
}

export default Dashboard