import React from 'react'

const DeleteAlertContent = ( { content, onDelete, disabled }) => {
  return (
    <div className='p-5'>
      <p className='text-[14px]'>{content}</p>
     <div className='flex justify-end mt-6'>
        <button className='rounded-lg bg-red-700 px-5 py-2 font-bold text-white hover:bg-red-800 disabled:opacity-60' disabled={disabled} type='button' onClick={onDelete}>
            {disabled ? "Deleting…" : "Delete"}
        </button>
     </div>
    </div>
  )
}

export default DeleteAlertContent
