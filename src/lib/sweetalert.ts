"use client"

import Swal from "sweetalert2"

// Function to show an information alert
export const showInfoAlert = (title, text) => {
  Swal.fire({
    title: title,
    text: text,
    icon: "info",
    confirmButtonText: "ตกลง"
  })
}

// Function to show an error alert
export const showErrorAlert = (title, text) => {
  Swal.fire({
    title: title,
    text: text,
    icon: "error",
    confirmButtonText: "ตกลง"
  })
}

// Function to show a success alert
export const showSuccessAlert = (title, text) => {
  Swal.fire({
    title: title,
    text: text,
    icon: "success",
    confirmButtonText: "ตกลง"
  })
}

// Function to show a warning alert
export const showWarningAlert = (title, text) => {
  Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    confirmButtonText: "ตกลง"
  })
}

export const showConfirmationDialog = async message => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, do it!"
  })
  return result.isConfirmed
}
