import React, { forwardRef, useImperativeHandle, useContext, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../../../../components/input/inputtext";
import FileUploadField from "../../../../components/input/FileUploadField";
import InputAreaField from "../../../../components/input/TextArea";

import { PropertyContext } from "../../../../MyContext/MyContext";
import OptionInputField from "../../../../components/input/drop_down";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../components/Redux/store";
import { personnels } from "../../../../components/Redux/personnel/personnel_thunk";
import { directors } from "../../../../components/Redux/directors/directors_thunk";

interface PropertySpecificationsHandles {
  handleSubmit: () => void;
  isValid: boolean;
}

interface PropertySpecificationsFormValues {
  bedrooms: string;
  bathrooms: string;
  propertySize: string;
  landSize: string;
  parkingSpaces: string;
  yearBuilt: string;
  unitsAvailable: string;
  description: string;
  overview: string;
  documents: File[];
  director_id: string; // Add this field
}
interface DropdownOption {
  label: string;
  value: string | number;
}

const PropertySpecifications = forwardRef<PropertySpecificationsHandles>(
  (props, ref) => {
    const { formData, setSpecifications } = useContext(PropertyContext)!;
     const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
  dispatch(directors());
  }, [dispatch]);

  const {
    loading: userLoading,
    error: userError,
data
  } = useSelector((state: RootState) => state.directors);
 
const labels: DropdownOption[] = Array.isArray(data)
  ? data.map(person => ({
      label: `${person.first_name} ${person.last_name}`,
      value: person.id,
    }))
  : [];


    const validationSchema = Yup.object().shape({
      bedrooms: Yup.string().required("Number of bedrooms is required"),
      bathrooms: Yup.string().required("Number of bathrooms is required"),
      propertySize: Yup.string().required("Property size is required"),
      description: Yup.string().required("Description is required"),
      overview: Yup.string().required("Overview is required"),
      director_id: Yup.string().required("Director is required"), // Add validation
    });


  const formik = useFormik<PropertySpecificationsFormValues>({
    initialValues: {
      bedrooms: formData.specifications?.bedrooms || "",
      bathrooms: formData.specifications?.bathrooms || "",
      propertySize: formData.specifications?.propertySize || "",
      landSize: formData.specifications?.landSize || "",
      parkingSpaces: formData.specifications?.parkingSpaces || "",
      yearBuilt: formData.specifications?.yearBuilt || "",
      unitsAvailable: formData.specifications?.unitsAvailable || "",
      description: formData.specifications?.description || "",
      overview: formData.specifications?.overview || "",
      documents: formData.specifications?.documents || [],
      director_id: formData.specifications?.director_id || "",
    },
    validationSchema,
    onSubmit: (values) => {
      setSpecifications(values);
    },
  });


  const validateAndSubmit = useCallback(async () => {
    try {
      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        formik.setTouched(
          Object.keys(errors).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {} as Record<string, boolean>)
        );
        return false;
      }
      formik.handleSubmit();
      return true;
    } catch (error) {
      console.error("Validation error:", error);
      return false;
    }
  }, [formik]);


    useImperativeHandle(ref, () => ({
    handleSubmit: validateAndSubmit,
    isValid: formik.isValid && Object.keys(formik.touched).length > 0,
  }));



    return (
      <form onSubmit={formik.handleSubmit} className="space-y-[30px]">
        <OptionInputField
          label="Role"
          placeholder="Select director"
          name="director_id"
          value={formik.values.director_id}
          onChange={(value: any) => formik.setFieldValue("director_id", value)}
          options={labels}
          dropdownTitle="Roles"
          error={
            formik.touched.director_id && formik.errors.director_id
              ? formik.errors.director_id
              : undefined
          }
        />
        <div className="grid md:grid-cols-2 gap-12">
          <InputField
            label="Number of Bedrooms"
            placeholder="Enter Number of Bedrooms"
            name="bedrooms"
            value={formik.values.bedrooms}
            onChange={(e) => {
              let newValue = e.target.value.replace(/,/g, "");
              if (/^\d*$/.test(newValue)) {
                {
                  formik.setFieldValue("bedrooms", newValue);
                }
              }
            }}
            error={
              formik.touched.bedrooms && formik.errors.bedrooms
                ? formik.errors.bedrooms
                : undefined
            }
          />
          <InputField
            label="Number of Bathrooms"
            placeholder="Enter Number of Bathrooms"
            name="bathrooms"
            value={formik.values.bathrooms}
            onChange={(e) => {
              let newValue = e.target.value.replace(/,/g, "");
              if (/^\d*$/.test(newValue)) {
                {
                  formik.setFieldValue("bathrooms", newValue);
                }
              }
            }}
            error={
              formik.touched.bathrooms && formik.errors.bathrooms
                ? formik.errors.bathrooms
                : undefined
            }
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12"></div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="relative">
            <p className="text-sm font-[325] text-[#768676] absolute top-10 z-20 right-3">
              Sq M
            </p>
            <InputField
              label="Property Size"
              placeholder="Enter Property Size"
              name="propertySize"
              value={formik.values.propertySize}
              onChange={(e) => {
                let newValue = e.target.value.replace(/,/g, "");
                if (/^\d*$/.test(newValue)) {
                  {
                    formik.setFieldValue("propertySize", newValue);
                  }
                }
              }}
              error={
                formik.touched.propertySize && formik.errors.propertySize
                  ? formik.errors.propertySize
                  : undefined
              }
            />
          </div>

          <InputField
            label="Land Size"
            placeholder="Enter Land Size"
            name="landSize"
            value={formik.values.landSize}
            onChange={(e) => {
              let newValue = e.target.value.replace(/,/g, "");
              if (/^\d*$/.test(newValue)) {
                {
                  formik.setFieldValue("landSize", newValue);
                }
              }
            }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <InputField
            label="Parking Spaces"
            placeholder="Enter Parking Spaces"
            name="parkingSpaces"
            value={formik.values.parkingSpaces}
            onChange={(e) => {
              let newValue = e.target.value.replace(/,/g, "");
              if (/^\d*$/.test(newValue)) {
                {
                  formik.setFieldValue("parkingSpaces", newValue);
                }
              }
            }}
          />

          <InputField
            label="Year Built"
            placeholder="Enter Year Built"
            name="yearBuilt"
            value={formik.values.yearBuilt}
            onChange={formik.handleChange}
            type="date"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <InputField
            label="Units Available"
            placeholder="Enter Units Available"
            name="unitsAvailable"
            value={formik.values.unitsAvailable}
            onChange={(e) => {
              let newValue = e.target.value.replace(/,/g, "");
              if (/^\d*$/.test(newValue)) {
                {
                  formik.setFieldValue("unitsAvailable", newValue);
                }
              }
            }}
          />
        </div>

        <InputAreaField
          label="Description"
          placeholder="Enter your Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          required
          rows={6}
          error={
            formik.touched.description && formik.errors.description
              ? formik.errors.description
              : undefined
          }
        />

        <InputAreaField
          label="Overview"
          placeholder="Enter your Overview"
          name="overview"
          value={formik.values.overview}
          onChange={formik.handleChange}
          required
          rows={6}
          error={
            formik.touched.overview && formik.errors.overview
              ? formik.errors.overview
              : undefined
          }
        />

        <FileUploadField
          label="Upload Document"
          placeholder=" Upload Property Agreement"
          onChange={(files) => formik.setFieldValue("documents", files)}
          accept=".pdf,.doc,.docx"
        />
      </form>
    );
  }
);

PropertySpecifications.displayName = "PropertySpecifications";

export default PropertySpecifications;
