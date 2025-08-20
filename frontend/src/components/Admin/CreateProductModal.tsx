import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCreateProduct } from '../../hooks/useProducts';
import { ProductRequest } from '../../types';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProductModal({ isOpen, onClose }: CreateProductModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const createProductMutation = useCreateProduct();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<ProductRequest>();

  const onSubmit = async (data: ProductRequest) => {
    if (!selectedImage) {
      setError('root', { message: 'Please select an image' });
      return;
    }

    try {
      await createProductMutation.mutateAsync({
        product: data,
        image: selectedImage,
      });
      reset();
      setSelectedImage(null);
      onClose();
    } catch (error: any) {
      setError('root', {
        message: error.response?.data?.message || 'Failed to create product',
      });
    }
  };

  const handleClose = () => {
    reset();
    setSelectedImage(null);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Create New Product
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <input
                      {...register('name', { required: 'Product name is required' })}
                      type="text"
                      className="input-field mt-1"
                      placeholder="Enter product name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      {...register('description', { required: 'Description is required' })}
                      rows={3}
                      className="input-field mt-1"
                      placeholder="Enter product description"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Price
                      </label>
                      <input
                        {...register('price', {
                          required: 'Price is required',
                          min: { value: 0, message: 'Price must be positive' },
                        })}
                        type="number"
                        step="0.01"
                        className="input-field mt-1"
                        placeholder="0.00"
                      />
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Stock
                      </label>
                      <input
                        {...register('stock', {
                          required: 'Stock is required',
                          min: { value: 0, message: 'Stock must be non-negative' },
                        })}
                        type="number"
                        className="input-field mt-1"
                        placeholder="0"
                      />
                      {errors.stock && (
                        <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Category ID
                      </label>
                      <input
                        {...register('categoryId', {
                          required: 'Category ID is required',
                          min: { value: 1, message: 'Invalid category ID' },
                        })}
                        type="number"
                        className="input-field mt-1"
                        placeholder="1"
                      />
                      {errors.categoryId && (
                        <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Brand ID
                      </label>
                      <input
                        {...register('brandId', {
                          required: 'Brand ID is required',
                          min: { value: 1, message: 'Invalid brand ID' },
                        })}
                        type="number"
                        className="input-field mt-1"
                        placeholder="1"
                      />
                      {errors.brandId && (
                        <p className="mt-1 text-sm text-red-600">{errors.brandId.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Product Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                      className="input-field mt-1"
                    />
                    {selectedImage && (
                      <p className="mt-1 text-sm text-gray-600">
                        Selected: {selectedImage.name}
                      </p>
                    )}
                  </div>

                  {errors.root && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm text-red-600">{errors.root.message}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createProductMutation.isPending}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}