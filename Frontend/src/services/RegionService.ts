const API_WILAYAH = "https://ibnux.github.io/data-indonesia";

export const RegionService = {
  getProvinces: async () => {
    const res = await fetch(`${API_WILAYAH}/provinsi.json`);
    return await res.json();
  },
  getCities: async (provId: string) => {
    const res = await fetch(`${API_WILAYAH}/kabupaten/${provId}.json`);
    return await res.json();
  },
  getDistricts: async (cityId: string) => {
    const res = await fetch(`${API_WILAYAH}/kecamatan/${cityId}.json`);
    return await res.json();
  },
  getVillages: async (distId: string) => {
    const res = await fetch(`${API_WILAYAH}/kelurahan/${distId}.json`);
    return await res.json();
  },
};