import { PrismaClient, ProductCategory, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@1234", 12);
  const customerHash = await bcrypt.hash("Customer@1234", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@cattleya.lk" },
    update: {},
    create: { name: "CATTLEYA Admin", email: "admin@cattleya.lk", passwordHash, role: Role.ADMIN },
  });

  await prisma.user.upsert({
    where: { email: "customer@cattleya.lk" },
    update: {},
    create: { name: "CATTLEYA Customer", email: "customer@cattleya.lk", passwordHash: customerHash, role: Role.CUSTOMER },
  });

  const categories = [ProductCategory.TSHIRT, ProductCategory.SHIRT, ProductCategory.SARONG, ProductCategory.FROCK, ProductCategory.CROP_TOP, ProductCategory.SAREE, ProductCategory.LUNGI];
  const products = [
    { name: "Indigo Peacock Batik Tee", category: ProductCategory.TSHIRT, price: 2200 },
    { name: "Golden Lotus Batik Saree", category: ProductCategory.SAREE, price: 8500 },
    { name: "Earth Tone Batik Shirt", category: ProductCategory.SHIRT, price: 4200 },
    { name: "Cerulean Wave Sarong", category: ProductCategory.SARONG, price: 3200 },
    { name: "Rainbow Bloom Frock", category: ProductCategory.FROCK, price: 5100 },
    { name: "Teal Garden Crop Top", category: ProductCategory.CROP_TOP, price: 2600 },
    { name: "Royal Night Lungi", category: ProductCategory.LUNGI, price: 1800 },
    { name: "Cinnamon Vine Batik Tee", category: ProductCategory.TSHIRT, price: 2400 },
    { name: "Sunrise Mandala Shirt", category: ProductCategory.SHIRT, price: 4600 },
    { name: "Azure Petal Sarong", category: ProductCategory.SARONG, price: 3400 },
  ];

  for (let index = 0; index < products.length; index += 1) {
    const item = products[index];
    const created = await prisma.product.create({
      data: {
        name: item.name,
        slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: `${item.name} crafted for the CATTLEYA collection.`,
        category: item.category,
        basePrice: item.price,
        images: [`https://placehold.co/1200x1200/C9A84C/0A0A0A.png?text=${encodeURIComponent(item.name)}`],
        tags: ["batik", "handcrafted", "cattleya"],
        isFeatured: index < 4,
      },
    });

    await prisma.productVariant.createMany({
      data: [
        { productId: created.id, size: "S", color: "Indigo Blue", colorHex: "#203864", priceModifier: 0, stockQty: 20, sku: `${created.slug}-s-indigo` },
        { productId: created.id, size: "M", color: "Cream White", colorHex: "#F5F0E8", priceModifier: 100, stockQty: 18, sku: `${created.slug}-m-cream` },
        { productId: created.id, size: "L", color: "Earthy Brown", colorHex: "#8B5E3C", priceModifier: 150, stockQty: 12, sku: `${created.slug}-l-brown` },
      ],
    });
  }

  await prisma.coupon.createMany({
    data: [
      { code: "CATTLEYA10", discountPct: 10, maxUses: 500, expiresAt: new Date("2030-01-01T00:00:00Z") },
      { code: "HEAVEN15", discountPct: 15, maxUses: 500, expiresAt: new Date("2030-01-01T00:00:00Z") },
    ],
    skipDuplicates: true,
  });

  console.log(`Seeded CATTLEYA data for ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
