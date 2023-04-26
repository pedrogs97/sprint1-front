interface Material {
    id: number | null,
    name: string,
    description: string,
    observation: string,
    quantity: number,
    price: number,
    last_replacement: string | null,
    updated_at: string | null
}

export default Material