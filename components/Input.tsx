"use client"
import React from 'react'
import { Control, useForm } from 'react-hook-form'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormFieldTypes } from './forms/PatientForm'
import Image from 'next/image'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { Checkbox } from './ui/checkbox'

interface CustomProps {
    control: Control<any>,
    fieldType: FormFieldTypes,
    name: string,
    placeholder?: string,
    iconSrc?: string,
    iconAlt?: string,
    label?: string,
    disabled?: boolean,
    dateFormat?: string,
    showTimeSelect?: boolean,
    children?: React.ReactNode,
    renderSkeleton?: (field: any) => React.ReactNode
}

const RenderField = ({ field, props }: { field: any, props: CustomProps }) => {
    const { control, name, fieldType, label, placeholder, iconSrc, iconAlt, showTimeSelect, dateFormat, renderSkeleton } = props
    switch (props.fieldType) {
        case FormFieldTypes.INPUT:
            return (
                <div className='flex rounded-md border border-dark-500 bg-dark-400'>
                    {iconSrc && (
                        <Image src={iconSrc} width={24} height={24} alt={iconAlt || "icon"} className='ml-2' />
                    )}

                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            {...field}
                            className='shad-input border-0'
                        />
                    </FormControl>
                </div>
            )

        case FormFieldTypes.TEXTAREA:
            return (
                <Textarea placeholder={placeholder} {...field} className='shad-textArea' disabled={props.disabled}></Textarea>
            )
        case FormFieldTypes.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput
                        placeholder={placeholder}
                        value={field.value}
                        onChange={field.onChange}
                        defaultCountry='US'
                        international
                        withCountryCallingCode
                        className="input-phone"
                    />
                </FormControl>
            )
        case FormFieldTypes.DATE_PICKER:
            return (
                <div className='flex rounded-md border border-dark-500 bg-dark-400'>
                    <Image src="/assets/icons/calendar.svg" height={24} width={24} alt="calendar" className='ml-2' />
                    <FormControl>
                        <DatePicker selected={field.value} onChange={(date) => field.onChange(date)}
                            dateFormat={dateFormat ?? "MM/dd/yyy"}
                            showTimeSelect={showTimeSelect ?? false}
                            timeInputLabel='Time:'
                            wrapperClassName='date-picker'
                        />
                    </FormControl>
                </div>
            )
        case FormFieldTypes.SELECT:
            return (
                <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className='shad-select-trigger'>
                                <SelectValue className='' placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className='shad-select-content'>
                            {props.children}
                        </SelectContent>
                    </Select>
                </FormControl>
            )
        case FormFieldTypes.SKELETON:
            return (
                renderSkeleton ? renderSkeleton(field) : null
            )
        case FormFieldTypes.CHECKBOX:
            return (
                <div className='flex items-center gap-4'>
                    <Checkbox 
                    id={name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                    <label htmlFor={name} className='checkbox-label'>
                        {label}
                    </label>
                </div>
            )    
        default:
            break;
    }
}

const CustomInput = (props: CustomProps) => {
    const { control, name, fieldType, label, placeholder, iconSrc, iconAlt } = props
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className='flex-1'>
                    {fieldType !== FormFieldTypes.CHECKBOX && label && (
                        <FormLabel>{label}</FormLabel>
                    )}
                    <RenderField
                        field={field}
                        props={props}
                    />

                    <FormMessage className='shad-error' />
                </FormItem>
            )}
        />
    )
}

export default CustomInput