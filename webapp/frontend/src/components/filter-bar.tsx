"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function FilterBar() {
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    size: "",
    condition: "",
  })

  const clearFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: "" }))
  }

  const clearAllFilters = () => {
    setFilters({
      type: "",
      category: "",
      size: "",
      condition: "",
    })
  }

  const activeFilters = Object.entries(filters).filter(([_, value]) => value !== "")

  return (
    <div className="space-y-4 z-50">
      <div className="flex flex-wrap gap-3 ">
        <Select value={filters.type} onValueChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}>
          <SelectTrigger className="w-[140px] bg-white">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="Venta"className="hover:bg-gray-200">Venta</SelectItem>
            <SelectItem value="Donación"className="hover:bg-gray-200">Donación</SelectItem>
            <SelectItem value="Intercambio"className="hover:bg-gray-200">Intercambio</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.category}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
        >
          <SelectTrigger className="w-[140px] bg-white">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="vestidos"className="hover:bg-gray-200">Vestidos</SelectItem>
            <SelectItem value="camisetas"className="hover:bg-gray-200">Camisetas</SelectItem>
            <SelectItem value="pantalones"className="hover:bg-gray-200">Pantalones</SelectItem>
            <SelectItem value="chaquetas"className="hover:bg-gray-200">Chaquetas</SelectItem>
            <SelectItem value="zapatos"className="hover:bg-gray-200">Zapatos</SelectItem>
            <SelectItem value="bolsos"className="hover:bg-gray-200">Bolsos</SelectItem>
            <SelectItem value="accesorios"className="hover:bg-gray-200">Accesorios</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.size} onValueChange={(value) => setFilters((prev) => ({ ...prev, size: value }))}>
          <SelectTrigger className="w-[100px] bg-white">
            <SelectValue placeholder="Talla" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="xs"className="hover:bg-gray-200">XS</SelectItem>
            <SelectItem value="s"className="hover:bg-gray-200">S</SelectItem>
            <SelectItem value="m"className="hover:bg-gray-200">M</SelectItem>
            <SelectItem value="l"className="hover:bg-gray-200">L</SelectItem>
            <SelectItem value="xl"className="hover:bg-gray-200">XL</SelectItem>
            <SelectItem value="xxl"className="hover:bg-gray-200">XXL</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.condition}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, condition: value }))}
        >
          <SelectTrigger className="w-[140px] bg-white">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="nuevo"className="hover:bg-gray-200">Nuevo</SelectItem>
            <SelectItem value="como-nuevo"className="hover:bg-gray-200">Como nuevo</SelectItem>
            <SelectItem value="muy-bueno" className="hover:bg-gray-200">Muy bueno</SelectItem>
            <SelectItem value="bueno" className="hover:bg-gray-200">Bueno</SelectItem>
            <SelectItem value="regular" className="hover:bg-gray-200">Regular</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Filtros activos:</span>
          {activeFilters.map(([key, value]) => (
            <Badge key={key} variant="secondary" className="flex items-center gap-1">
              {value}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => clearFilter(key)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-primary-custom hover:text-primary-custom/80"
          >
            Limpiar todo
          </Button>
        </div>
      )}
    </div>
  )
}
