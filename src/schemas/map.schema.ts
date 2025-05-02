import { z } from "zod";

// Map Schema
export const MapSchema = z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    description: z.string().nullable().optional(),
    owner: z.string(),
    createdAt: z.date().nullable().optional(),
    updateAt: z.date().nullable().optional(),
  });
  
  // Country Schema
  export const CountrySchema = z.object({
    id: z.string(),
    name: z.string(),
    area: z.string(),
    description: z.string().nullable().optional(),
    map: z.string(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
  });
  
  // Town Schema
  export const TownSchema = z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string(),
    description: z.string().nullable().optional(),
    map: z.string(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
  });
  
  // Village Schema
  export const VillageSchema = z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string(),
    description: z.string().nullable().optional(),
    map: z.string(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
  });
  
  // PointOfInterest Schema
  export const PointOfInterestSchema = z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string(),
    description: z.string().nullable().optional(),
    map: z.string(),
    town: z.string(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
  });
  
  // Population Schema
  export const PopulationSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
    map: z.string(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
  });
  
  // Culture Schema
  export const CultureSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable().optional(),
    map: z.string(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
  });