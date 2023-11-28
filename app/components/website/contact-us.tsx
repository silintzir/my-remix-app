import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useWebsiteStore } from "./store";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ValidationError } from "./validation-error";
import { validationSchema } from "./validation";
import type { ContactData } from "./types";

export default function ContactUs() {
  const {
    contactModalOpen: open,
    setContactModalOpen: setOpen,
    setThankYouModalOpen,
  } = useWebsiteStore();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactData>({ resolver: zodResolver(validationSchema) });

  const onSubmit = async (data: ContactData) => {
    try {
      const url = "/contact";
      const api = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
      });
      await api.json();
    } catch (e) {
      window.alert("Server error");
    }
    reset();
    setOpen(false);
    setTimeout(() => {
      setThankYouModalOpen(true);
    }, 200);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <div className="isolate bg-white px-8 py-8">
                  <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                      Contact us
                    </h2>
                  </div>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mx-auto max-w-2xl mt-8"
                  >
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="first-name"
                          className="block text-sm font-semibold leading-6 text-gray-900"
                        >
                          First name <span className="text-red-600">*</span>
                        </label>
                        <div className="mt-2.5">
                          <input
                            type="text"
                            {...register("firstName")}
                            autoComplete="given-name"
                            disabled={isSubmitting}
                            className={clsx(
                              "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            )}
                          />
                          {errors.firstName && (
                            <ValidationError msg={errors.firstName?.message} />
                          )}
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="last-name"
                          className="block text-sm font-semibold leading-6 text-gray-900"
                        >
                          Last name <span className="text-red-600">*</span>
                        </label>
                        <div className="mt-2.5">
                          <input
                            type="text"
                            {...register("lastName")}
                            disabled={isSubmitting}
                            autoComplete="family-name"
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.lastName && (
                            <ValidationError msg={errors.lastName?.message} />
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold leading-6 text-gray-900"
                        >
                          Email <span className="text-red-600">*</span>
                        </label>
                        <div className="mt-2.5">
                          <input
                            type="email"
                            {...register("email")}
                            disabled={isSubmitting}
                            autoComplete="email"
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.email && (
                            <ValidationError msg={errors.email?.message} />
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="company"
                          className="block text-sm font-semibold leading-6 text-gray-900"
                        >
                          Company
                        </label>
                        <div className="mt-2.5">
                          <input
                            type="text"
                            disabled={isSubmitting}
                            {...register("company")}
                            autoComplete="organization"
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                          {errors.company && (
                            <ValidationError msg={errors.company?.message} />
                          )}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <label
                          htmlFor="message"
                          className="block text-sm font-semibold leading-6 text-gray-900"
                        >
                          Message <span className="text-red-600">*</span>
                        </label>
                        <div className="mt-2.5">
                          <textarea
                            {...register("message")}
                            rows={4}
                            disabled={isSubmitting}
                            className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            defaultValue={""}
                          />
                          {errors.message && (
                            <ValidationError msg={errors.message?.message} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-10 flex flex-col gap-2">
                      <button
                        type="submit"
                        className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="block w-full rounded-md bg-gray-300 px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm hover:bg-gray-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
