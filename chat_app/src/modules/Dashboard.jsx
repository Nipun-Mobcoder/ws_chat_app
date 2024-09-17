import { useState } from 'react'
import Avatar from '../assets/avatar.svg'
import Avatar2 from '../assets/avatar2.svg'
import Avatar3 from '../assets/avatar3.svg'
import Input from '../component/Input'

const Dashboard = () => {
  const contacts = [
    {
      name: "Harsh",
      msg: 'Hey, how are you?',
      img: Avatar3
    },
    {
      name: "Aditya",
      msg: 'Wassup',
      img: Avatar2
    },
    {
      name: "Karan",
      msg: 'Yes',
      img: Avatar
    },
    {
      name: "Vatsal",
      msg: '...',
      img: Avatar2
    },
    {
      name: "Lakshay",
      msg: 'Image',
      img: Avatar
    },
    {
      name: "Sanyam",
      msg: 'Hey',
      img: Avatar3
    }
  ]

  const [message, setMessage] = useState('');

  return (
    <div className='w-screen flex'>
        <div className='w-[25%] h-screen bg-secondary'>
          <div className='flex items-center my-8 mx-14'>
            <img src={Avatar} width={75} height={75} className='border border-primary p-[2px] rounded-full' />
            <div className='ml-4'>
              <h3 className='text-2xl'>Nipun</h3>
              <p className='text-lg font-light'>My account</p>
            </div>
          </div>
          <hr />
          <div className='mx-14 mt-5'>
  					<div className='text-primary text-lg'>Messages</div>
            {
              contacts.map(({ img, name, msg })=> {
                return (
                  <div className='flex items-center py-8 border-b border-b-gray-300' key={name}>
                    <div className='cursor-pointer flex items-center'>
                      <div><img src={img} className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary" /></div>
                      <div className='ml-6'>
                        <h3 className='text-lg font-semibold'>{name}</h3>
                        <p className='text-sm font-light text-gray-600'>{msg}</p>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className='w-[50%] h-screen bg-white flex flex-col items-center'>
        <div className='w-[75%] bg-secondary h-[80px] my-14 rounded-full flex items-center px-14 py-2'>
						<div className='cursor-pointer'><img src={Avatar} width={60} height={60} className="rounded-full" /></div>
						<div className='ml-6 mr-auto'>
							<h3 className='text-lg'>Karan</h3>
							<p className='text-sm font-light text-gray-600'>karan@gmail.com</p>
						</div>
						<div className='cursor-pointer'>
							<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-phone-outgoing" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" fill="none" strokeLinecap="round" strokeLinejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
								<line x1="15" y1="9" x2="20" y2="4" />
								<polyline points="16 4 20 4 20 8" />
							</svg>
						</div>
					</div>
          <div className='h-[75%] w-full overflow-y-scroll shadow-sm'>
					<div className='p-14'>
                <div className={`max-w-[40%] rounded-b-xl p-4 mb-6 bg-primary text-white rounded-tl-xl ml-auto`}>Lorem ipsums, corrupti!</div>
                <div className={`max-w-[40%] rounded-b-xl p-4 mb-6 bg-secondary rounded-tr-xl'`}>Lorem ipsum dolous perspiciatis, psi libero unde laudantium totam omnis aliquid arrupti!</div>
                <div className={`max-w-[40%] rounded-b-xl p-4 mb-6 bg-primary text-white rounded-tl-xl ml-auto`}>Loicing etiae in? Quasi libero unde laudantium totam omnis aliquid ad reprehenderit ex deleniti! Alias, corrupti!</div>
                <div className={`max-w-[40%] rounded-b-xl p-4 mb-6 bg-secondary rounded-tr-xl'`}>Lorem ipsum dolor, sit amet antium totam omnis aliquid ad reprehenderit ex deleniti! Alias, corrupti!</div>
                <div className={`max-w-[40%] rounded-b-xl p-4 mb-6 bg-primary text-white rounded-tl-xl ml-auto`}> Quasi libero unde laudantium totam omnis aliquid </div>
              </div>
            </div>
          <div className='p-14 w-full flex items-center'>
              <Input placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)} className='w-[75%]' inputClassName='p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none' />
              <div className={`ml-4 p-2 cursor-pointer bg-light rounded-full`}>
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
        </div>
        <div className='w-[25%] h-screen bg-secondary'>
        </div>
    </div>
  )
}

export default Dashboard