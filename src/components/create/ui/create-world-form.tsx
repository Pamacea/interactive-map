"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CrownButton } from "@/components/ui/crown-button";
import { cn } from "@/lib/utils";
import { Upload, Globe, Lock, MapPin, X } from "lucide-react";
import { createWorld } from "../methods/create-world";

export function CreateWorldForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: true,
    map: null as File | null,
  });

  const mutation = useMutation({
    mutationFn: createWorld,
    onSuccess: (data) => {
      if (data?.worldId) {
        router.push(`/world/${data.worldId}`);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await mutation.mutateAsync({
        title: formData.name,
        description: formData.description,
        isPublic: formData.isPublic,
        map: formData.map || undefined,
      });

      if (result?.worldId) {
        router.push(`/world/${result.worldId}`);
      }
    } catch (error) {
      console.error("[create-world-form] Submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* World Name */}
      <div className="grid gap-3">
        <Label htmlFor="world-name" className="text-bone text-sm font-display tracking-wide">
          World Name
        </Label>
        <Input
          id="world-name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter your realm's name..."
          className="bg-obsidian/60 border-iron text-bone placeholder:text-bone-dark/50 focus:border-accent-gold"
        />
      </div>

      {/* Description */}
      <div className="grid gap-3">
        <Label htmlFor="description" className="text-bone text-sm font-display tracking-wide">
          Description
        </Label>
        <Textarea
          id="description"
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your realm... Its history, its people, its secrets."
          rows={4}
          className="bg-obsidian/60 border-iron text-bone placeholder:text-bone-dark/50 focus:border-accent-gold resize-none"
        />
      </div>

      {/* Map Image */}
      <div className="grid gap-3">
        <Label className="text-bone text-sm font-display tracking-wide">
          Map Image
        </Label>
        <div className="relative">
          {formData.map ? (
            <div className="relative h-32 rounded-lg border border-accent-gold/30 bg-obsidian/40 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center gap-3">
                <Upload className="w-6 h-6 text-accent-gold" />
                <span className="text-sm text-bone">{formData.map.name}</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, map: null })}
                  className="absolute top-2 right-2 p-1 rounded bg-blood/20 hover:bg-blood/40 text-blood transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-3 h-32 px-4 rounded-lg border-2 border-dashed border-iron bg-obsidian/40 cursor-pointer hover:border-accent-gold/50 hover:bg-obsidian/60 transition-all group">
              <Upload className="w-6 h-6 text-bone-dark group-hover:text-accent-gold transition-colors" />
              <span className="text-sm text-bone-dark group-hover:text-bone transition-colors">
                Click to upload your map
              </span>
              <input
                id="map-image"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, map: e.target.files?.[0] || null })}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Visibility Toggle */}
      <div className="grid gap-3">
        <Label className="text-bone text-sm font-display tracking-wide">
          Visibility
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, isPublic: true })}
            className={cn(
              "flex items-center justify-center gap-2 h-14 rounded border transition-all duration-300",
              formData.isPublic
                ? "bg-accent-gold/20 border-accent-gold text-accent-gold shadow-lg shadow-accent-gold/10"
                : "bg-obsidian/40 border-iron text-bone-dark hover:border-accent-gold/50"
            )}
          >
            <Globe className="w-5 h-5" strokeWidth={1.5} />
            <span className="font-display text-sm tracking-wide">Public</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, isPublic: false })}
            className={cn(
              "flex items-center justify-center gap-2 h-14 rounded border transition-all duration-300",
              !formData.isPublic
                ? "bg-accent-gold/20 border-accent-gold text-accent-gold shadow-lg shadow-accent-gold/10"
                : "bg-obsidian/40 border-iron text-bone-dark hover:border-accent-gold/50"
            )}
          >
            <Lock className="w-5 h-5" strokeWidth={1.5} />
            <span className="font-display text-sm tracking-wide">Private</span>
          </button>
        </div>
        <p className="text-xs text-bone-dark/70 font-fell italic">
          {formData.isPublic
            ? "Your world will be visible to all explorers"
            : "Only you can access this realm"}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-iron">
        <CrownButton
          type="button"
          variant="iron"
          size="md"
          onClick={() => router.back()}
        >
          Cancel
        </CrownButton>
        <CrownButton
          type="submit"
          variant="gold"
          size="lg"
          disabled={mutation.isPending}
        >
          <MapPin className="w-5 h-5" strokeWidth={1.5} />
          {mutation.isPending ? "Forging..." : "Forge World"}
        </CrownButton>
      </div>
    </form>
  );
}
