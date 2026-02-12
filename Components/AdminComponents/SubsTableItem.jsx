import React from 'react'

const SubsTableItem = ({mongoId,email,date,deleteFunc}) => {
  return (
    <tr className='bg-white border-b text-left'>
        <th scope='row' className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
            {email?email:"No Email"}
        </th>
        <td className='px-6 py-4 hidden sm:block'>{date}</td>
        <td onClick={()=>deleteFunc(mongoId)} className='px-6 py-4 cursor-pointer'>x</td>
    </tr>
  )
}

export default SubsTableItem