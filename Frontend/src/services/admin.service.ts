import axios from "axios";
import { User, Partner } from "../types/user.ts";

const API = import.meta.env.VITE_API_URL;

// USERS
export const getAllUsers = async (): Promise<User[]> => {
  const res = await axios.get(`${API}/api/admin/users`, {
    withCredentials: true,
  });
  return res.data.data;
};

export const banUser = async (id: string): Promise<User> => {
  const res = await axios.patch(
    `${API}/api/admin/users/${id}/ban`,
    {},
    { withCredentials: true }
  );

  return res.data.data;
};

// PARTNERS
export const getAllPartners = async (): Promise<Partner[]> => {
  const res = await axios.get(`${API}/api/admin/partners`, {
    withCredentials: true,
  });

  return res.data.data;
};

export const approvePartner = async (id: string): Promise<Partner> => {
  const res = await axios.patch(
    `${API}/api/admin/partners/${id}/approve`,
    {},
    { withCredentials: true }
  );

  return res.data.data;
};

export const rejectPartner = async (id: string): Promise<Partner> => {
  const res = await axios.patch(
    `${API}/api/admin/partners/${id}/reject`,
    {},
    { withCredentials: true }
  );

  return res.data.data;
};

export const banPartner = async (id: string): Promise<Partner> => {
  const res = await axios.patch(
    `${API}/api/admin/partners/${id}/ban`,
    {},
    { withCredentials: true }
  );

  return res.data.data;
};