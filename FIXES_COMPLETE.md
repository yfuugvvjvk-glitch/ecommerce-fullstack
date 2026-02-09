# 🔧 LISTA COMPLETĂ DE CORECȚII NECESARE

## ✅ PRIORITATE MAXIMĂ

### 1. Paginare 10 Itemi - TOATE Listele

- [ ] ProductsManagement.tsx - produse
- [ ] OrdersManagement.tsx - comenzi
- [ ] VouchersManagement.tsx - vouchere
- [ ] InvoicesManagement.tsx - facturi
- [ ] DeliveryLocationsManager.tsx - locații livrare
- [ ] UsersManagement.tsx - utilizatori
- [ ] CategoriesManagement.tsx - categorii
- [ ] OffersManagement.tsx - oferte
- [ ] MediaManager.tsx - media files

### 2. Carousel - Poziții Ocupate

- [ ] Afișare poziții 1-10 ocupate în ProductsManagement
- [ ] Indicator vizual pentru poziții libere/ocupate
- [ ] Validare: nu permite aceeași poziție pentru 2 produse
- [ ] Sortare automată după carouselOrder

### 3. Control Carousel în Media

- [ ] Tab "Carousel" în MediaManager
- [ ] Drag & drop pentru reordonare
- [ ] Preview carousel în timp real
- [ ] Activare/dezactivare produse din carousel

### 4. Erori de Corectare

- [ ] Traduceri incomplete (română)
- [ ] Calcule preț incorect (fixed vs per_unit)
- [ ] Încărcări lente (loading states)
- [ ] Afișări inconsistente (formatare)
- [ ] Validări lipsă (formulare)

## 📋 PLAN DE IMPLEMENTARE

### Faza 1: Paginare (30 min)

1. Aplicare Pagination component în toate listele
2. State management pentru currentPage
3. Slice arrays la 10 itemi
4. Test pe fiecare pagină

### Faza 2: Carousel (20 min)

1. Fetch poziții ocupate din API
2. Afișare vizuală în form
3. Validare poziții duplicate
4. Control în Media tab

### Faza 3: Corecții (40 min)

1. Traduceri complete
2. Fix calcule prețuri
3. Loading states
4. Validări formulare
5. Formatări consistente

## 🎯 REZULTAT FINAL

- ✅ Toate listele cu paginare 10 itemi
- ✅ Carousel complet funcțional cu poziții vizibile
- ✅ Control carousel din Media
- ✅ Zero erori în consolă
- ✅ Traduceri complete în română
- ✅ Calcule corecte peste tot
- ✅ Loading states pentru toate operațiunile
- ✅ Validări complete pe toate formularele
