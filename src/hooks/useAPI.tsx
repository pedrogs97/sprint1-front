import api from "../service/api"
import Material from "../schemas/stock"

const useAPI = () => {

    const getAllMaterials = async function (): Promise<Material[]> {
        const response = await api.get('materials/');
        
        return response.data as Array<Material>;
    }

    const updateMaterial = async function (id: number, data: any): Promise<Material | undefined> {
        const response = await api.put(`materials/${id}/`, data);

        return response.data as Material;
    }

    const createMaterial = async function (data: Material): Promise<Material | undefined> {
        const response = await api.post('materials/', data);
        return response.data as Material;
    }

    const deleteMaterial = async function (id: number): Promise<boolean> {
        const response = await api.delete(`materials/${id}/`);

        return response.status === 204;
    }


    return {
        getAllMaterials,
        updateMaterial,
        createMaterial,
        deleteMaterial
    }
}

export default useAPI;