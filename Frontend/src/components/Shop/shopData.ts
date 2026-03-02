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
    title: "thighBag",
    reviews: 5,
    price: 1250000,
    discountedPrice: 950000,
    id: 3,
    idProduct: "tas_mini",
    imgs: {
      thumbnails: [
        "/images/products/product-thighBag.png",
        "/images/products/product-thighBag.png",
      ],
      previews: [
        "/images/products/product-thighBag.png",
        "/images/products/product-thighBag.png",
      ],
    },
  },
];

export default shopData;