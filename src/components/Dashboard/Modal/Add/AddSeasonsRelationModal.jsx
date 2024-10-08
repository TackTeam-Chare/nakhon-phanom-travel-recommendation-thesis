import React, { useEffect, useState, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { createSeasonsRelation } from "@/services/admin/insert";
import { getSeasons, getPlaces } from "@/services/admin/get";
import { FaMapMarkerAlt, FaCalendarAlt, FaPlus, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Select from "react-select";

const MySwal = withReactContent(Swal);

const AddSeasonsRelationModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [seasons, setSeasons] = useState([]);
  const [touristEntities, setTouristEntities] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [seasonsData, touristEntitiesData] = await Promise.all([
          getSeasons(),
          getPlaces(),
        ]);

        // Filter tourist locations based on the category name
        const filteredTouristEntities = touristEntitiesData.filter(
          (entity) => entity.category_name === "สถานที่ท่องเที่ยว"
        );

        setSeasons(seasonsData);
        setTouristEntities(filteredTouristEntities);
      } catch (error) {
        console.error("Error fetching data:", error);
        MySwal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการดึงข้อมูล",
          showConfirmButton: true,
        });
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      // Prepare the seasonRelations data
      const seasonRelations = data.season_ids.map((season) => ({
        season_id: season.value,
        tourism_entities_id: data.tourism_entities_id,
      }));

      // Call the API to insert the relations
      await createSeasonsRelation({ seasonRelations });

      MySwal.fire({
        icon: "success",
        title: "ความสัมพันธ์ถูกสร้างสำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
      onClose();
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการสร้างความสัมพันธ์",
        text: "กรุณาลองอีกครั้ง",
        showConfirmButton: true,
      });
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
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
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    เพิ่มความสัมพันธ์ระหว่างฤดูกาลและสถานที่ท่องเที่ยว
                  </Dialog.Title>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 mt-4"
                  >
            <div className="relative z-0 w-full mb-6 group">
  <label
    htmlFor="tourism_entities_id"
    className="block text-sm font-medium text-gray-700"
  >
    สถานที่ท่องเที่ยว
  </label>
  <div className="mt-1 flex items-center relative">
    <FaMapMarkerAlt className="mr-2 text-gray-500" />
    <select
      id="tourism_entities_id"
      {...register("tourism_entities_id", {
        required: "กรุณาเลือกสถานที่ท่องเที่ยว",
        valueAsNumber: true,
      })}
      className="block w-full py-2 px-3 bg-white border border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
      style={{ maxHeight: '40vh', overflowY: 'auto' }} // Limit height for dropdown
    >
      <option value="">เลือกสถานที่ท่องเที่ยว</option>
      {touristEntities.map((entity) => (
        <option key={entity.id} value={entity.id}>
          {entity.name}
        </option>
      ))}
    </select>
  </div>
  {errors.tourism_entities_id && (
    <p className="text-red-500 text-xs mt-1">
      {errors.tourism_entities_id.message}
    </p>
  )}
</div>


                    <div className="relative z-0 w-full mb-6 group">
  <label
    htmlFor="season_ids"
    className="block text-sm font-medium text-gray-700"
  >
    ฤดูกาล (เลือกได้หลายฤดู)
  </label>
  <div className="mt-1 flex items-center">
    <FaCalendarAlt className="mr-2 text-gray-500" />
    <Controller
      name="season_ids"
      control={control}
      rules={{ required: "กรุณาเลือกฤดูกาล" }}
      render={({ field }) => (
        <Select
          {...field}
          isMulti
          options={seasons.map((season) => ({
            value: season.id,
            label: season.name,
          }))}
          placeholder="เลือกฤดูกาล"
          className="w-full"
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            control: (base, state) => ({
              ...base,
              borderColor: state.isFocused ? '#FB923C' : base.borderColor, // Orange border when focused
              boxShadow: state.isFocused ? '0 0 0 1px #FB923C' : base.boxShadow, // Orange box shadow on focus
              "&:hover": {
                borderColor: '#FB923C', // Orange border on hover
              },
            }),
          }}
        />
      )}
    />
  </div>
  {errors.season_ids && (
    <p className="text-red-500 text-xs mt-1">
      {errors.season_ids.message}
    </p>
  )}
</div>


                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="mr-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300 ease-in-out flex items-center gap-2"
                        onClick={onClose}
                      >
                        <FaTimes />
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition duration-300 ease-in-out flex items-center gap-2"
                      >
                        <FaPlus />
                        เพิ่มความสัมพันธ์
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AddSeasonsRelationModal;
