"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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
      <div className="grid gap-2">
        <Label htmlFor="world-name">World Name</Label>
        <Input
          id="world-name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter world name..."
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your world..."
          rows={4}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="map-image">Map Image</Label>
        <div className="flex items-center gap-4">
          <label className="flex-1 flex items-center justify-center gap-3 h-32 px-4 rounded-lg border-2 border-dashed border-border-subtle bg-background-card/60 backdrop-blur-sm cursor-pointer hover:border-accent-gold/50 transition-all">
            <Upload className="w-6 h-6 text-text-muted" />
            <span className="text-sm text-text-muted">
              {formData.map ? formData.map.name : "Click to upload"}
            </span>
            <input
              id="map-image"
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, map: e.target.files?.[0] || null })}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Visibility</Label>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={formData.isPublic ? "default" : "outline"}
            onClick={() => setFormData({ ...formData, isPublic: true })}
            className={cn(
              "h-14",
              formData.isPublic && "bg-accent-gold text-background-base hover:bg-accent-gold/90"
            )}
          >
            <Globe className="w-5 h-5" />
            Public
          </Button>
          <Button
            type="button"
            variant={!formData.isPublic ? "default" : "outline"}
            onClick={() => setFormData({ ...formData, isPublic: false })}
            className={cn(
              "h-14",
              !formData.isPublic && "bg-accent-gold text-background-base hover:bg-accent-gold/90"
            )}
          >
            <Lock className="w-5 h-5" />
            Private
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" size="lg" disabled={mutation.isPending}>
          <MapPin className="w-5 h-5" />
          {mutation.isPending ? "Creating..." : "Create World"}
        </Button>
      </div>
    </form>
  );
}
