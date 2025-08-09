import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input: React.FC<InputProps> = ({ 
  icon, 
  rightIcon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          {icon}
        </div>
      )}
      <input
        className={`
          w-full 
          px-4 
          py-3 
          ${icon ? 'pl-12' : ''} 
          ${rightIcon ? 'pr-12' : ''} 
          bg-white/20 
          backdrop-blur-sm 
          border 
          border-white/30 
          rounded-lg 
          placeholder-gray-500 
          text-gray-800 
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500/50 
          focus:border-blue-500/50 
          transition-all 
          duration-200
          ${className}
        `}
        {...props}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
          {rightIcon}
        </div>
      )}
    </div>
  )
}

export default Input
