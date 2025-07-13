import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed initial products
  await prisma.product.createMany({
    data: [
      {
        content_type: "images",
        description: "Images",
      },
      {
        content_type: "link",
        description: "Link",
      },
    ],
  });

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
