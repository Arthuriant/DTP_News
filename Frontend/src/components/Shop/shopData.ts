import { Product } from "@/types/product";

const shopData: Product[] = [
  {
    title: "Bag Bat Kulit Premium",
    reviews: 15,
    price: 1150000,
    discountedPrice: 2220000,
    id: 1,
    idProduct: "tas_kelalawar",
    imgs: {
      thumbnails: [
        "/images/products/product-tasKelalawar.png",
        "/images/products/product-tasKelalawar.png",
      ],
      previews: [
        "/images/products/product-tasKelalawar.png",
        "/images/products/product-tasKelalawar.pngg",
      ],
    },
  },
  {
    title: "Totebag Kulit Premium",
    reviews: 5,
    price: 555555,
    discountedPrice: 249000,
    id: 2,
    idProduct: "totebag",
    imgs: {
      thumbnails: [
        "/images/products/product-totebag.png",
        "/images/products/product-totebag.png",
      ],
      previews: [
        "/images/products/product-totebag.png",
        "/images/products/product-totebag.png",
      ],
    },
  },
  {
    title: "Vintage Leather Backpack",
    reviews: 5,
    price: 189.0,
    discountedPrice: 145.0,
    id: 3,
    idProduct: "bayu",
    imgs: {
      thumbnails: [
        "/images/products/product-3.png",
        "/images/products/product-3.png",
      ],
      previews: [
        "/images/products/product-3.png",
        "/images/products/product-3.png",
      ],
    },
  },
];

export default shopData;