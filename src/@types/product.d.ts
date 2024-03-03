enum UnitOfMeasurement {
  "UNIT",
  "PAIR",
  "PACKAGE"
}

export interface IProduct {
  id: string
  label: string
  coverUrl: string,
  isEPI: boolean,
  unitOfMeasurement: "UNIT" | "PAIR"| "PACKAGE",
  unitPerPackage: number | null,
  updatedAt: Date,
  createdAt: Date,
  variants: {
    id: string
    label: string
    quantity: number
  }[]
}