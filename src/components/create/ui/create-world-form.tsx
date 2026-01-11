"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Upload, Globe, Lock, MapPin } from "lucide-react";
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
    mutation.mutate({
      title: formData.name,
      description: formData.description,
      isPublic: formData.isPublic,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-text-primary">World Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter world name..."
          className="w-full h-11 px-4 rounded-lg border border-border-subtle bg-background-card/60 backdrop-blur-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-text-primary">Description</label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your world..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-border-subtle bg-background-card/60 backdrop-blur-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all resize-none"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-text-primary">Map Image</label>
        <div className="flex items-center gap-4">
          <label className="flex-1 flex items-center justify-center gap-3 h-32 px-4 rounded-lg border-2 border-dashed border-border-subtle bg-background-card/60 backdrop-blur-sm cursor-pointer hover:border-accent-gold/50 transition-all">
            <Upload className="w-6 h-6 text-text-muted" />
            <span className="text-sm text-text-muted">
              {formData.map ? formData.map.name : "Click to upload"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, map: e.target.files?.[0] || null })}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-text-primary">Visibility</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, isPublic: true })}
            className={`flex items-center justify-center gap-3 h-14 px-4 rounded-lg border transition-all ${
              formData.isPublic
                ? "border-accent-gold bg-accent-gold/10 text-accent-gold"
                : "border-border-subtle bg-background-card/60 backdrop-blur-sm text-text-secondary hover:border-border-subtle"
            }`}
          >
            <Globe className="w-5 h-5" />
            <span className="font-medium">Public</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, isPublic: false })}
            className={`flex items-center justify-center gap-3 h-14 px-4 rounded-lg border transition-all ${
              !formData.isPublic
                ? "border-accent-gold bg-accent-gold/10 text-accent-gold"
                : "border-border-subtle bg-background-card/60 backdrop-blur-sm text-text-secondary hover:border-border-subtle"
            }`}
          >
            <Lock className="w-5 h-5" />
            <span className="font-medium">Private</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          Cancel
        </button>
        <Button type="submit" size="lg" disabled={mutation.isPending}>
          <MapPin className="w-5 h-5" />
          {mutation.isPending ? "Creating..." : "Create World"}
        </Button>
      </div>
    </form>
  );
}
