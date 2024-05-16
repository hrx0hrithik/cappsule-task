import React from 'react'

const Button = ({ name, value, isSelected, isAvailable, label, handleChange }) => {
  return (
    <>
      <label className={`rounded-lg text-xs px-[12px] py-[6px] my-[5px] mx-[10px]
        ${isSelected ? 'font-semibold border-[1.5px] border-[#112D31] text-[#112D31]' : 'font-normal border-[1px] border-[#ABABAB] text-[#555555]'} 
        ${isAvailable ? 'border-solid' : 'border-dashed'}
        ${isSelected && isAvailable ? 'shadow-button' : ""}
        `}
      >
        <input
          type="radio"
          name={name}
          value={value}
          checked={isSelected}
          onChange={() => handleChange(value)}
          style={{ display: "none" }}
        />
        {label}
      </label>
    </>
  );
}

export default Button