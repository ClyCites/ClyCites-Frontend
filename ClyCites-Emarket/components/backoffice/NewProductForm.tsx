"use client"

import React, {useState} from 'react'
import FormHeader from '@/components/backoffice/FormHeader'
import TextInput from '@/components/FormInputs/TextInput'
import {useForm} from "react-hook-form";
import SubmitButton from '@/components/FormInputs/SubmitButton';
import TextareaInput from '@/components/FormInputs/TextAreasInput';
import { generateSlug } from '@/lib/generateSlug';
import ImageInput from '@/components/FormInputs/ImageInput';
import { makePostRequest } from '@/lib/apiRequest';
import SelectInput from '@/components/FormInputs/SelectInput';
import ArrayItemsInput from '@/components/FormInputs/ArrayItemsInput';
import { watch } from 'lucide-react';
import ToggleInput from '@/components/FormInputs/ToggleInput';
import {generateUserCode} from '@/lib/generateUserCode';
import { useRouter } from "next/navigation"; // For Next.js 13+

export default function NewProductForm({categories,farmers}) {
  const [imageUrl, setImageUrl] = useState("")
  
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(false)
  const {register,reset,watch,handleSubmit,formState: {errors}} = useForm({
    defaultValues:{
      isActive: true,
      isWholeSale: false
    }
  });
  const isActive = watch("isActive");
  const isWholeSale = watch("isWholeSale")
  const router = useRouter()
  function redirect(){
    router.push("/dashboard/products")
  }
  async function onSubmit(data){
    // setLoading(true)
    const slug = generateSlug(data.title);
    const productCode = generateUserCode('LLP', data.title)
    data.slug = slug;
    data.imageUrl = imageUrl;
    data.tags = tags;
    data.qty = 1;
    data.productCode = productCode;
  console.log(data);
  makePostRequest(
    setLoading,
    "api/products",
    data,
    "Product",
    reset,redirect
  );
  setImageUrl("");
  setTags([])
  }
  return (
    <div>
      <FormHeader title="New Product"/>

      <form action="" onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 mx-auto my-3"
      >

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <TextInput
            label="Product Title"
            name="title"
            register={register}
            errors={errors}
            // className='w-full'
          />
          <TextInput
            label="Product SKU"
            name="sku"
            register={register}
            errors={errors}
            className='w-full'
          />
          
          <TextInput
            label="Product Barcode"
            name="barcode"
            register={register}
            errors={errors}
            className='w-full'
          />
          <TextInput
            label="Product Price (Before Discount)"
            name="productPrice"
            type='number'
            register={register}
            errors={errors}
            className='w-full'
          />
          <TextInput
            label="Product Sale Price (Discounted)"
            name="salePrice"
            type='number'
            register={register}
            errors={errors}
            className='w-full'
          />
          <TextInput
            label="Product Stock"
            name="productStock"
            type='number'
            register={register}
            errors={errors}
            className='w-full'
          />

          <TextInput
            label="Unit of Measurement(eg Kilograms)"
            name="unit"
            register={register}
            errors={errors}
            className='w-full'
          />
          
          <SelectInput
            label="Select Category"
            name="categoryId"
            register={register}
            errors={errors}
            className='w-full'
            options={categories}
          />
          <SelectInput
            label="Select Farmer"
            name="farmerId"
            register={register}
            errors={errors}
            className='w-full'
            options={farmers}
          />
          <ToggleInput 
          label="Supports WholeSale Selling" 
          name="isWholeSale" 
          trueTitle="Supported" 
          falseTitle="Not Supported" 
          register={register}
          />
          {
            isWholeSale&&(
              <>
              <TextInput
            label="WholeSale Price"
            name="wholesalePrice"
            type='number'
            register={register}
            errors={errors}
            className='w-full'
          />
          <TextInput
            label="Minimum WholeSale Qty"
            name="wholesaleQty"
            type='number'
            register={register}
            errors={errors}
            className='w-full'
          />
              </>
            )
          }
          
          <ImageInput imageUrl={imageUrl} setImageUrl={setImageUrl} endpoint="productImageUploader" label="Product Image"/>
         
          {/* Tags  */}
          <ArrayItemsInput setItems={setTags} items={tags} itemTitle="Tag"/>
          
          <TextareaInput
            label="Product Description"
            name="description"
            register={register}
            errors={errors}
          />

          <ToggleInput 
          label="Publish Your Product" 
          name="isActive" 
          trueTitle="Active" 
          falseTitle="InActive" 
          register={register}
          />

        </div>
        <SubmitButton isLoading={loading} buttonTitle="Create Product" loadingButtonTitle="Creating Product please wait..."/>

      </form>
      
    </div>
  )
}
