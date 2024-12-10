import { Select, Space } from "antd";
import type { SelectProps } from 'antd';
import { DefaultOptionType } from "antd/es/select";
import React, { useEffect, useRef, useState } from "react";
import './style.scss'
import images from "assets";
import { Checkbox } from "@mui/material";

interface Option {
    value: string;
    label: string;
}

type Options = {
    label: string,
    value: any
}

interface IProps {
    list: Options[]
    onSelected: (value: any[]) => void
    error?: string
    initialValue?: number[]
}

const MultipleSelect = ({list, onSelected, error, initialValue}: IProps) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [onchangeValue, setOnchangeValue] = useState('');
    const [isInputFocus, setInputFocus] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<DefaultOptionType[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleRemoveOption = (option: DefaultOptionType) => {
        const updatedOptions = selectedOptions.filter((selectedOption) => selectedOption.value !== option.value);
        setOnchangeValue(updatedOptions.map((e) => e.label).join(', '))
        setSelectedOptions(updatedOptions);
        onSelected(updatedOptions)
    };

    const handleSelectOption = (option: Option) => {
        const exist = [...selectedOptions, option]
        setOnchangeValue((prev) => {
            let text = prev
            if (text.length === 0) {
                text = `${option.label}`
            } else {
                text = text + `, ${option.label}`
            }
            return text
        })
        onSelected(exist)
        setSelectedOptions(exist);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const inputSpacingWithLabel = 'pt-[1.625rem] pb-[0.375rem]';

    useEffect(() => {
        if(initialValue){
            setOnchangeValue('')
            const exist = list.filter((e) => initialValue.some((x) => x === e.value))
            exist.forEach((e) => {
                setOnchangeValue((prev) => {
                    let text = prev
                    if (text.length === 0) {
                        text = `${e.label}`
                    } else {
                        text = text + `, ${e.label}`
                    }
                    return text
                })
            })
            onSelected(exist)
            setSelectedOptions(exist);
        }
    },[initialValue])

    return <div className="relative" ref={containerRef}>
        <div className={`relative flex ${error ? 'border-red' : ''} items-center gap-4 rounded-xl overflow-hidden flex-row justify-between border-input-ink cursor-pointer`}>
            <label
                className={`cubic-bezier absolute left-0 top-0 w-[85%]'
                    } overflow-hidden text-ellipsis whitespace-nowrap ${!isInputFocus && selectedOptions.length === 0
                        ? 'pl-3 pr-3 py-4 text-base text-ink-40'
                        : 'pl-3 pr-3 py-[0.375rem] text-xs text-ink-60'
                    }`}
                onClick={() => {
                    inputRef.current?.focus();
                }}
            >
                Cấu hình sử dụng
            </label>
            <input
                type="text"
                value={onchangeValue}
                // onChange={(event) => setSearchTerm(event.target.value)}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`${inputSpacingWithLabel} relative text-ellipsis whitespace-nowrap bg-transparent cursor-pointer caret-input flex w-full flex-row p-4 bg-transparent gap-4 border-none border-none focus:outline-none ${!isInputFocus && selectedOptions.length === 0
                    ? 'placeholder-transparent'
                    : 'placeholder-ink-20'
                    }`}
                onBlur={(e) => {
                    setInputFocus(false);
                }}
                onFocus={(e) => {
                    setInputFocus(true);
                }}
                ref={inputRef}
            />
            <div
                className={`absolute right-3 top-[50%] translate-y-[-50%]`}
            >
                <img
                    className={`w-[1.5rem]`}
                    src={images.input.dropdown}
                    alt="Legend Ground"
                />
            </div>
        </div>

        {/* Dropdown */}
        <div>
            <div className={`absolute !z-[20000] w-full my-2 !overflow-auto !rounded-2xl !bg-dropdown shadow-popup 
                transition-transform duration-300 ease-out transform ${dropdownOpen ? 'translate-y-0 opacity-100 h-62-custom' : 'h-0 translate-y-4 opacity-0'}`}>
                {list.map((option) => {
                    const exist = selectedOptions.some((e) => e.value === option.value)
                    return <div className={`py-2 px-4 !cursor-pointer select-input-hover ${exist ? 'selected-input' : ''}`} key={option.value} onClick={() => {
                        if (exist) {
                            handleRemoveOption(option)
                            return
                        }
                        handleSelectOption(option)
                    }}>
                        <div className="flex flex-row gap-4 items-center">
                            <Checkbox sx={{
                                'svg': {
                                    color: 'white',
                                },
                            }} checked={exist} />
                            <span>{option.label}</span>
                        </div>
                    </div>
                })}
            </div>
        </div>
        <p className="text-red-100 text-sm ">{error ? error : ''}</p>
    </div>
}

export default MultipleSelect