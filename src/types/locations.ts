export interface Location {
  id: number;
  name: string;
  description: string;
  created_at: Date;
}

export interface LocationRequest extends Omit<Location, 'id' | 'created_at'> {}
