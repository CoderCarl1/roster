export type TpersonId = string;

export type Taddress = {
  personID: TpersonId;
  number: string;
  street: string;
  streetType: string;
  suburb: string;
  state: string;
  postcode: string;
};

export type Tperson = {
  id: TpersonId;
  fName: string;
  lName: string;
  address: Taddress[];
};

export type Tappointment = {
  id: string;
  time: string;
  customerId: string;
  notes?: string;
  recurring: boolean;
  frequency: number | "weekly" | "fortnightly" | "monthly";
};