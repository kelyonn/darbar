import { Product } from '../types';

export const products: Product[] = [
  // Men's Collection
  {
    id: 'shabaz',
    name: 'Shabaz',
    price: 30000,
    description: 'Exquisite sherwani crafted with finest silk and adorned with intricate gold embroidery, perfect for royal occasions.',
    category: 'mens',
    images: ['/shabaz.jpg'],
    fabric: 'Silk',
    colors: ['Gold', 'Ivory', 'Royal Blue'],
    sizes: ['38', '40', '42', '44'],
    artisanStory: 'Handcrafted by master artisans from Lucknow, each piece takes over 3 months to complete using traditional zardozi techniques.'
  },
  {
    id: 'zarif',
    name: 'Zarif',
    price: 50000,
    description: 'Royal kurta with coat and shawl with intricate details and gold embroidery along with matching trouser.',
    category: 'mens',
    images: ['/zarif.jpg'],
    fabric: 'Silk',
    colors: ['Gold', 'Ivory', 'Royal Blue'],
    sizes: ['38', '40', '42', '44'],
    artisanStory: 'Handcrafted by master artisans from Lucknow, each piece takes over 3 months to complete using traditional zardozi techniques.'
  },
  {
    id: 'meher',
    name: 'Meher',
    price: 25000,
    description: 'Black kurta and pant with beautiful pashmina printed shawl.',
    category: 'mens',
    images: ['/meher.jpg'],
    fabric: 'Silk',
    colors: ['Gold', 'Ivory', 'Royal Blue'],
    sizes: ['38', '40', '42', '44'],
    artisanStory: 'Handcrafted by master artisans from Lucknow, each piece takes over 3 months to complete using traditional zardozi techniques.'
  },
  {
    id: 'gulrez',
    name: 'Gulrez',
    price: 42999,
    description: 'Teal coat with embroidery and charcoal grey kurta and shawl with minimal details and embroidery along with grey dhoti.',
    category: 'mens',
    images: ['/gulrez.jpg'],
    fabric: 'Silk',
    colors: ['Gold', 'Ivory', 'Royal Blue'],
    sizes: ['38', '40', '42', '44'],
    artisanStory: 'Handcrafted by master artisans from Lucknow, each piece takes over 3 months to complete using traditional zardozi techniques.'
  },
  {
    id: 'nawabiyat',
    name: 'Nawabiyat',
    price: 59999,
    description: 'Long black coat with gold thread embroidery and intricate designs all over with a black trouser.',
    category: 'mens',
    images: ['/nawabiyat.jpg'],
    fabric: 'Silk',
    colors: ['Gold', 'Ivory', 'Royal Blue'],
    sizes: ['38', '40', '42', '44'],
    artisanStory: 'Handcrafted by master artisans from Lucknow, each piece takes over 3 months to complete using traditional zardozi techniques.'
  },
  {
    id: 'farshi',
    name: 'Farshi',
    price: 48999,
    description: 'Black sherwani with silver thread embroidery all over and black trouser.',
    category: 'mens',
    images: ['/farshi.jpg'],
    fabric: 'Silk',
    colors: ['Gold', 'Ivory', 'Royal Blue'],
    sizes: ['38', '40', '42', '44'],
    artisanStory: 'Handcrafted by master artisans from Lucknow, each piece takes over 3 months to complete using traditional zardozi techniques.'
  },

  
  // Women's Collection
  {
    id: 'nishat',
    name: 'Nishat',
    price: 39999,
    description: 'A luxurious brown and gold sharara set with crinkled fabric, intricate embroidery, pleated bottoms, and a matching embroidered dupatta.',
    category: 'womens',
    images: [ '/nishat.jpg' ],
    fabric: 'Velvet',
    colors: ['Emerald', 'Wine', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    artisanStory: 'Crafted by skilled artisans using traditional techniques passed down through generations.'
  },
  {
    id: 'izhaar',
    name: 'Izhaar',
    price: 39999,
    description: 'An elegant beige gown with intricate silver and gold embroidery, long sleeves, a fitted bodice, and embellishments.',
    category: 'womens',
    images: [ '/izhaar.jpg' ],
    fabric: 'Velvet',
    colors: ['Emerald', 'Wine', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    artisanStory: 'Crafted by skilled artisans using traditional techniques passed down through generations.'
  },
  {
    id: 'nayab',
    name: 'Nayab',
    price: 26999,
    description: 'A pastel green gown with floral embroidery, sequin embellishments, sheer sleeves, and a flared layered silhouette.',
    category: 'womens',
    images: [ '/nayab.jpg' ],
    fabric: 'Velvet',
    colors: ['Emerald', 'Wine', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    artisanStory: 'Crafted by skilled artisans using traditional techniques passed down through generations.'
  },
  {
    id: 'virasat',
    name: 'Virasat',
    price: 53999,
    description: 'An olive-green ensemble with intricate embroidery, flared silhouette, deep neckline, bell sleeves, and traditional motifs.',
    category: 'womens',
    images: [ '/virasat.jpg' ],
    fabric: 'Velvet',
    colors: ['Emerald', 'Wine', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    artisanStory: 'Crafted by skilled artisans using traditional techniques passed down through generations.'
  },
  {
    id: 'bekhudi',
    name: 'Bekhudi',
    price: 13999,
    description: 'A rich red velvet lehenga with gold stripes, deep-neck blouse, statement dupatta, and regal elegance.',
    category: 'womens',
    images: [ '/bekhudi.jpg' ],
    fabric: 'Velvet',
    colors: ['Emerald', 'Wine', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    artisanStory: 'Crafted by skilled artisans using traditional techniques passed down through generations.'
  },



  // Accessories
  {
    id: 'taj-e-zar',
    name: 'Taj-e-zar',
    price: 15999,
    description: 'Kundan pendant with pearls, ruby and emeralds',
    category: 'accessories',
    images: ['/taj-e-zar.jpg' ],
    fabric: 'n/a',
    colors: ['Gold'],
    sizes: ['One Size'],
    artisanStory: 'Handcrafted by master jewelers using traditional techniques and finest materials.'
  },
  {
    id: 'heer-e-mughal',
    name: 'Heer-e-mughal',
    price: 19999,
    description: 'Beautiful white turban with head piece made of sapphire ruby and emeralds.',
    category: 'accessories',
    images: ['/heer-e-mughal.jpg' ],
    fabric: 'n/a',
    colors: ['Gold'],
    sizes: ['One Size'],
    artisanStory: 'Handcrafted by master jewelers using traditional techniques and finest materials.'
  },
  {
    id: 'nageen_mala',
    name: 'Nageen Mala',
    price: 29999,
    description: 'Beautiful neck piece with colourful beads handing over.',
    category: 'accessories',
    images: ['/nageen_mala.jpg' ],
    fabric: 'n/a',
    colors: ['Gold'],
    sizes: ['One Size'],
    artisanStory: 'Handcrafted by master jewelers using traditional techniques and finest materials.'
  },
  {
    id: 'ayat-e-zar',
    name: 'Ayat-e-zar',
    price: 59999,
    description: 'Beautiful double layer zicron necklace with ruby and zicron earings with ruby.',
    category: 'accessories',
    images: ['/ayat-e-zar.jpg' ],
    fabric: 'n/a',
    colors: ['Gold'],
    sizes: ['One Size'],
    artisanStory: 'Handcrafted by master jewelers using traditional techniques and finest materials.'
  },
  {
    id: 'shahi_guluband',
    name: 'Shahi Guluband',
    price: 59999,
    description: 'Royal chocker with polki and kundans and ruby.',
    category: 'accessories',
    images: ['/shahi_guluband.jpg'],
    fabric: 'n/a',
    colors: ['Gold'],
    sizes: ['One Size'],
    artisanStory: 'Handcrafted by master jewelers using traditional techniques and finest materials.'
  },
  {
    id: 'the_nur_jahan',
    name: 'The Nur Jahan',
    price: 2499,
    description: 'Flats, crafted with rich burgundy velvet and adorned with intricate gold floral embroidery, exude a timeless elegance and sophistication.',
    category: 'accessories',
    images: ['/the_nur_jahan.jpg' ],
    fabric: 'n/a',
    colors: ['Gold'],
    sizes: ['One Size'],
    artisanStory: 'Handcrafted by master jewelers using traditional techniques and finest materials.'
  },
  {
    id: 'the_queens_grace',
    name: "The Queen's Grace",
    price: 3499,
    description: 'Flat shoes, crafted with exquisite white embroidery and adorned with delicate pearl embellishments, creating a regal and elegant look',
    category: 'accessories',
    images: ['/the_queens_grace.jpg' ],
    fabric: 'n/a',
    colors: ['Gold'],
    sizes: ['One Size'],
    artisanStory: 'Handcrafted by master jewelers using traditional techniques and finest materials.'
  },
  {
    id: 'the_zeb_un_nissa',
    name: 'The Zeb-un-Nissa',
    price: 3499,
    description: 'Flats, crafted with luxurious leather and adorned with intricate gold embroidery depicting delicate floral motifs, offer a timeless elegance and comfort for both everyday wear and special occasions.',
    category: 'accessories',
    images: ['/the_zeb_un_nissa.jpg' ],
    fabric: 'n/a',
    colors: ['Gold'],
    sizes: ['One Size'],
    artisanStory: 'Handcrafted by master jewelers using traditional techniques and finest materials.'
  },
  {
    id: 'noor_jahan',
    name: 'Noor Jahan',
    price: 9999,
    description: 'Black velvet, gold embroidery, gemstone embellishments, intricate design, elegant, vintage, luxurious, regal.',
    category: 'accessories',
    images: ['/noor_jahan.jpg' ],
    fabric: 'n/a',
    colors: ['Gold'],
    sizes: ['One Size'],
    artisanStory: 'Handcrafted by master jewelers using traditional techniques and finest materials.'
  },
  {
    id: 'rajkumari_noor_clucth',
    name: 'Rajkumari Noor Clucth',
    price: 5999,
    description: 'Ornate gold handbag with intricate beadwork, gemstones, circular handle, and regal elegance.',
    category: 'accessories',
    images: ['/rajkumari_noor_clucth.jpg' ],
    fabric: 'n/a',
    colors: ['Gold'],
    sizes: ['One Size'],
    artisanStory: 'Handcrafted by master jewelers using traditional techniques and finest materials.'
  },
];