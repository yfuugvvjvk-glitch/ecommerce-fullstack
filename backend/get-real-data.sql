-- Extrage toate produsele
SELECT id, name, price, stock, unit, "categoryId", "isActive" FROM "DataItem" ORDER BY "createdAt" DESC;

-- Extrage toate categoriile
SELECT id, name, slug, description, "parentId" FROM "Category" ORDER BY name;

-- Extrage toate locațiile
SELECT id, name, address, city, county, "postalCode", latitude, longitude FROM "DeliveryLocation" ORDER BY name;

-- Extrage toate media
SELECT id, filename, "originalName", "mimeType", size, path FROM "Media" ORDER BY "uploadedAt" DESC;
