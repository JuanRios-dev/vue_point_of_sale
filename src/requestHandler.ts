import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Swal, { SweetAlertIcon } from "sweetalert2";

interface ErrorResponse {
  status: number;
  errors?: any[];
  error?: string;
}

interface SuccessResponse<T> {
  status: number;
  data: T;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export function show_alert(
  message: string,
  icon: SweetAlertIcon,
  redirect: string | null = null
): void {
  if (redirect) {
    Swal.fire({
      title: message,
      icon: icon,
      showConfirmButton: false,
    });
  } else {
    Swal.fire({
      title: message,
      icon: icon,
    });
  }
}

export async function confirmAction(
  title: string,
  confirmButtonText: string
): Promise<boolean> {
  const alert = Swal.mixin({ buttonsStyling: true });

  const result = await alert.fire({
    title: title,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: confirmButtonText,
    cancelButtonText: "Cancelar",
  });

  return result.isConfirmed;
}

export async function sendRequest<T>(
  method: AxiosRequestConfig["method"],
  url: string,
  params?: any,
  showAlert: boolean = true,
  redirect: string | null = null,
  contentType: string | null = null
): Promise<ApiResponse<T>> {
  try {
    const headers: any = {};
    if (contentType !== null) {
      headers['Content-Type'] = contentType;
    }
    
    const response: AxiosResponse<T> = await axios({
      method,
      url,
      data: params,
      headers,
    });
    if (showAlert) {
      show_alert((response.data as any).message, "success", redirect);
    }
    if (redirect) {
      setTimeout(() => {
        window.location.href = redirect;
      }, 1000);
    }
    return { status: response.status, data: response.data };
  } catch (error: any) {
    if (showAlert && error.response && error.response.data.error) {
      show_alert(error.response.data.error, "error", redirect);
    }
    return {
      status: error.response.status,
      error: error.response.data.error,
      errors: error.response.data.errors,
    };
  }
}

export async function deleteItem(
  name: string,
  url: string,
  redirect: string | null = null,
  callback: (() => void) | null = null,
  responseCallback: ((response: any) => void) | null = null 
): Promise<void> {
  const confirmed = await confirmAction(
    `¿Estás seguro de eliminar a ${name}?`,
    "Sí, eliminar"
  );

  if (confirmed) {
    const response = await sendRequest("DELETE", url, null, true, redirect);
    if (!redirect && callback) {
      callback();
    }
    if (responseCallback) {
      responseCallback(response);
    }
  }
}
