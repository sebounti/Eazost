"use client"

import { useEffect, useState } from 'react'
import { Package, ShoppingCart, TrendingUp, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart } from "@tremor/react"
import Link from 'next/link'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Image from 'next/image'
import { Edit, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useAccommodationStore } from "@/stores/accommodationStore"
import { shop as shopSchema } from "@/db/appSchema"
import { useAuthStore } from "@/stores/authStore"
import { useStoreProduct } from "@/stores/StoreProduct"

// Définir le composant avant son utilisation
const ShopNameComponent = ({ shopId }: { shopId: number }) => {
  const { shop, fetchShopInfo } = useStoreProduct();

  useEffect(() => {
    fetchShopInfo(shopId);
  }, [shopId, fetchShopInfo]);

  if (!shop || shop.length === 0) {
    return <span className="text-gray-400">Nom du magasin non disponible</span>;
  }
  return <span>{shop[0].name}</span>;
};

export default function ShopManage() {
  const { user } = useAuthStore()
  const { accommodationInfo, fetchAccommodationInfo } = useAccommodationStore()
  const { fetchShopInfo, isLoading, shop, product } = useStoreProduct();
  const [selectedLodging, setSelectedLodging] = useState("all");

  useEffect(() => {
    async function loadData() {
      if (user?.user_id) {
        await fetchAccommodationInfo(user.user_id);
      }
    }
    loadData();
  }, [user?.user_id, fetchAccommodationInfo]);

  // Effet pour charger les données du shop quand accommodationInfo change
  useEffect(() => {
    if (accommodationInfo && accommodationInfo[0]) {
      // Récupérer le shop associé au premier logement
      fetchShopInfo(accommodationInfo[0].accommodation_id);
    }
  }, [accommodationInfo, fetchShopInfo]);


// Récupérer l'ID du magasin
  const shopId = shop.length > 0 ? shop[0].shop_id : 0;

  // Ajout des états pour la recherche et le filtre
  const [searchQuery, setSearchQuery] = useState("")

  const lodgingName = selectedLodging === 'all'
    ? 'Tous les magasins'
    : <ShopNameComponent shopId={parseInt(selectedLodging)} />;



  // Ajoutez ces états en haut de votre composant
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    reference: '',
    description: '',
    image: null as File | null
  })

  // Ajoutez cet état pour gérer le produit en cours de modification
  const [editingProduct, setEditingProduct] = useState({
    name: '',
    price: '',
    stock: '',
    reference: '',
    description: '',
    image: null as File | null
  })

  // Ajoutez ces données de performance simulées après les autres états
  const performanceMetrics = {
    totalRevenue: 24680,
    averageOrderValue: 123.40,
    bestSeller: "Produit Premium",
    bestSellerSales: 156,
    lowStock: 3,
  }

  // Ajoutez ces données de classement simulées
  const productRankings = {
    topProducts: [
      { name: "Produit Premium", sales: 156, revenue: 7800 },
      { name: "Produit Confort", sales: 124, revenue: 4960 },
      { name: "Produit Luxe", sales: 98, revenue: 5880 },
      { name: "Produit Essentiel", sales: 87, revenue: 2610 },
      { name: "Produit Élégance", sales: 76, revenue: 3800 }
    ],
    worstProducts: [
      { name: "Produit Basic", sales: 3, revenue: 90 },
      { name: "Produit Simple", sales: 5, revenue: 150 },
      { name: "Produit Standard", sales: 8, revenue: 240 }
    ]
  }


  const chartData = [
    { month: "Janvier", sales: 1200 },
    { month: "Février", sales: 1800 },
    { month: "Mars", sales: 1400 },
    { month: "Avril", sales: 2100 },
    { month: "Mai", sales: 1600 },
    { month: "Juin", sales: 2400 },
	{ month: "Juillet", sales: 2000 },
	{ month: "Aout", sales: 1600 },
	{ month: "Septembre", sales: 1200 },
	{ month: "Octobre", sales: 1600 },
	{ month: "Novembre", sales: 1300 },
	{ month: "Decembre", sales: 2200 },
  ]

  return (
    <>
      <div className="flex items-center gap-4 p-4">
        <SidebarTrigger className="text-xl" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-md" href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-xl text-amber-500" href="/dashboard/ShopManage">Boutique</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container pt-4 mx-auto">
        <h1 className="mb-4 text-4xl font-krona font-bold">Boutique</h1>
        <h2 className="mb-6 pb-4 text-xl text-gray-600">Gérer ici les produits de votre boutique.</h2>

        <div className="container p-4 mx-auto md:px-16 md:py-8 sm:px-8 sm:py-4">
          {/* Ajout des filtres */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un produit..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
				className="px-4 py-2 border rounded-xl"
				value={selectedLodging}
				onChange={(e) => setSelectedLodging(e.target.value)}
			>
			<option value="all">Tous les magasins</option>
				{Array.isArray(shop) &&
					shop.map((shopItem) => (
				<option key={shopItem.shop_id} value={shopItem.shop_id}>
					{shopItem.name}
				</option>
			))}
			</select>
          </div>
				{/* Graphique des ventes */}
				<Card className="col-span-2 hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg pb-2 font-medium md:text-xl">
                  Statistiques des Ventes
                </CardTitle>
                <TrendingUp className="w-8 h-8 text-amber-400" />
              </CardHeader>
              <CardContent>
                <BarChart
                  data={chartData}
                  index="month"
                  categories={["sales"]}
                  colors={["orange"]}
                  className="min-h-[300px] w-full mt-4"
                  yAxisWidth={48}
                  showLegend={false}
                  valueFormatter={(value) => `${value}€`}
                  showAnimation={true}
                  showGridLines={false}
                />
              </CardContent>
            </Card>


          <div className="grid gap-6 mt-6 md:grid-cols-2 sm:grid-cols-1">
            <Card className="col-span-2 hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Top 5 des Produits</CardTitle>
                <TrendingUp className="w-6 h-6 text-amber-400" />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rang</TableHead>
                      <TableHead>Produit</TableHead>
                      <TableHead className="text-right">Ventes</TableHead>
                      <TableHead className="text-right">Revenus</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productRankings.topProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">#{index + 1}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-right">{product.sales} unités</TableCell>
                        <TableCell className="text-right">{product.revenue.toLocaleString('fr-FR')}€</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>



            <Card className="col-span-2 hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium">Produits à Faible Performance</CardTitle>
                <TrendingUp className="w-6 h-6 text-red-400 rotate-180" />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produit</TableHead>
                      <TableHead className="text-right">Ventes</TableHead>
                      <TableHead className="text-right">Revenus</TableHead>
                      <TableHead className="text-right">Action Recommandée</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productRankings.worstProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell className="text-right">{product.sales} unités</TableCell>
                        <TableCell className="text-right">{product.revenue.toLocaleString('fr-FR')}€</TableCell>
                        <TableCell className="text-right">
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                            {product.sales < 5 ? 'Retirer du catalogue' : 'Promotion suggérée'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>



            {/* Commandes en cours */}
            <Card className="col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-medium md:text-xl">Commandes en Cours</CardTitle>
                <Package className="w-8 h-8 text-amber-400" />
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full rounded-md border">
                  <Table>
                    <TableHeader className="bg-slate-200 border-b">
                      <TableRow>
                        <TableHead className="text-md pt-4 text-gray-700 font-semibold">N° Commande</TableHead>
                        <TableHead className="text-md pt-4 text-gray-700 font-semibold">Client</TableHead>
                        <TableHead className="text-md pt-4 text-gray-700 font-semibold">Logement</TableHead>
                        <TableHead className="text-md pt-4 text-gray-700 font-semibold">Date</TableHead>
                        <TableHead className="text-md pt-4 text-gray-700 font-semibold">Statut</TableHead>
                        <TableHead className="text-md pt-4 text-gray-700 font-semibold text-right">Montant</TableHead>
                        <TableHead className="text-md pt-4 text-gray-700 font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <TableRow key={i} className="hover:bg-slate-100">
                          <TableCell className="font-medium">CMD-{i}234</TableCell>
                          <TableCell>Client {i}</TableCell>
                          <TableCell>Logement {i}</TableCell>
                          <TableCell>{new Date().toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>
                            <span className={`px-3 py-1 text-sm rounded-full ${
                              i % 3 === 0 ? "bg-green-100 text-green-800" :
                              i % 3 === 1 ? "bg-yellow-100 text-yellow-800" :
                              "bg-blue-100 text-blue-800"
                            }`}>
                              {i % 3 === 0 ? "Livré" : i % 3 === 1 ? "En cours" : "Préparation"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{(i * 25.99).toFixed(2)}€</TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="text-gray-900 bg-amber-400 hover:bg-amber-500">
                                  Voir la commande
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl bg-slate-100 p-4 rounded-md">
                                <DialogHeader>
                                  <DialogTitle>Détails de la commande CMD-{i}234</DialogTitle>
                                </DialogHeader>
                                <div className="mt-4 space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Informations client</h4>
                                      <p>Client {i}</p>
                                      <p>email@example.com</p>
                                      <p>+33 6 12 34 56 78</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">Logement</h4>
                                      <p>Logement {i}</p>
                                      <p>123 rue Example</p>
                                      <p>75000 Paris</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Produits commandés</h4>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Produit</TableHead>
                                          <TableHead>Quantité</TableHead>
                                          <TableHead className="text-right">Prix</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        <TableRow>
                                          <TableCell>Produit Example</TableCell>
                                          <TableCell>2</TableCell>
                                          <TableCell className="text-right">39.98€</TableCell>
                                        </TableRow>
                                      </TableBody>
                                    </Table>
                                  </div>
                                  <div className="flex justify-between items-center pt-4 border-t">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-bold text-xl">{(i * 25.99).toFixed(2)}€</span>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6">
              Produits du Shop - {lodgingName}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Carte pour ajouter un nouveau produit */}
              <Card className="hover:shadow-lg transition-shadow duration-200 group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-gray-300 rounded-lg group-hover:border-amber-400 transition-colors">
                    <Dialog open={isAddProductModalOpen} onOpenChange={setIsAddProductModalOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="shadow-lg text-gray-900 text-md bg-amber-400 rounded-xl hover:bg-amber-500 transition-colors"
                        >
                          Ajouter un nouveau produit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl bg-slate-50 p-4 rounded-md">
                        <DialogHeader>
                          <DialogTitle>Ajouter un nouveau produit</DialogTitle>
                          <DialogDescription>
                            Remplissez les informations du nouveau produit
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <label htmlFor="name">Nom du produit</label>

                            <Input
                              id="name"
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <label htmlFor="price">Prix (€)</label>
                              <Input
                                id="price"
                                type="number"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                              />
                            </div>
                            <div className="grid gap-2">
                              <label htmlFor="stock">Stock</label>
                              <Input
                                id="stock"
                                type="number"
                                value={newProduct.stock}
                                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <label htmlFor="description">Description</label>
                            <textarea
                              id="description"
                              value={newProduct.description}
                              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                            />
                          </div>
                          <div className="grid gap-2">
                            <label htmlFor="image">Photo du produit</label>
                            <div className="flex items-center gap-4">
                              {newProduct.image ? (
                                <div className="relative w-24 h-24">
                                  <Image
                                    src={URL.createObjectURL(newProduct.image)}
                                    alt="Aperçu"
                                    width={500}
                                    height={300}
                                    className="w-full h-40 object-cover rounded-md"
                                  />
                                  <Button
                                    size="icon"
                                    variant="destructive"
                                    className="absolute -top-2 -right-2 h-6 w-6"
                                    onClick={() => setNewProduct({...newProduct, image: null})}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <Input
                                  id="image"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      setNewProduct({...newProduct, image: file})
                                    }
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddProductModalOpen(false)}>
                            Annuler
                          </Button>
                          <Button
                            className="bg-amber-400 text-gray-900 hover:bg-amber-500"
                            onClick={() => {
                              // Ajoutez ici la logique pour sauvegarder le produit
                              console.log('Nouveau produit:', newProduct)
                              setIsAddProductModalOpen(false)
                            }}
                          >
                            Créer le produit
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>



              {/* Cartes des produits existants */}
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-square relative">
                        <Image
                          src="/images/default-product.jpg"
                          alt={`Produit ${i}`}
                          width={500}
                          height={300}
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                      <div className="bg-slate-50 absolute top-2 right-2 flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="bg-slate-200 hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4 text-amber-400" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-50 p-4 rounded-md">
                            <DialogHeader>
                              <DialogTitle>Modifier le produit</DialogTitle>
                              <DialogDescription>
                                Modifiez les informations du produit
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <label htmlFor="edit-name">Nom du produit</label>
                                <Input
                                  id="edit-name"
                                  value={editingProduct.name}
                                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <label htmlFor="edit-price">Prix (€)</label>
                                  <Input
                                    id="edit-price"
                                    type="number"
                                    value={editingProduct.price}
                                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <label htmlFor="edit-stock">Stock</label>
                                  <Input
                                    id="edit-stock"
                                    type="number"
                                    value={editingProduct.stock}
                                    onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                                  />
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <label htmlFor="edit-description">Description</label>
                                <textarea
                                  id="edit-description"
                                  value={editingProduct.description}
                                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                                />
                              </div>
                              <div className="grid gap-2">
                                <label htmlFor="edit-image">Photo du produit</label>
                                <div className="flex items-center gap-4">
                                  {editingProduct.image ? (
                                    <div className="relative w-24 h-24">
                                      <Image
                                        src={URL.createObjectURL(editingProduct.image)}
                                        alt="Aperçu"
                                        width={500}
                                        height={300}
                                        className="w-full h-40 object-cover rounded-md"
                                      />
                                      <Button
                                        size="icon"
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 h-6 w-6"
                                        onClick={() => setEditingProduct({...editingProduct, image: null})}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Input
                                      id="edit-image"
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                          setEditingProduct({...editingProduct, image: file})
                                        }
                                      }}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => {
                                // Réinitialiser le formulaire
                                setEditingProduct({
                                  name: '',
                                  price: '',
                                  stock: '',
                                  reference: '',
                                  description: '',
                                  image: null
                                })
                              }}>
                                Annuler
                              </Button>
                              <Button
                                className="bg-amber-400 text-gray-900 hover:bg-amber-500"
                                onClick={() => {
                                  // Ajoutez ici la logique pour sauvegarder les modifications
                                  console.log('Produit modifié:', editingProduct)
                                }}
                              >
                                Enregistrer les modifications
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              className=" bg-slate-200  hover:bg-red-200"
                            >
                              <Trash2 className="h-4 w-4 text-red-500"/>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-slate-50 p-4 rounded-md">
                            <DialogHeader>
                              <DialogTitle>Supprimer le produit</DialogTitle>
                              <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer ce produit ?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-4 mt-4">
                              <Button variant="outline">Annuler</Button>
                              <Button variant="destructive">Supprimer</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">Produit {i}</h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Référence: PRD-{i}00{i}</span>
                        <span className="font-bold text-lg">{(i * 19.99).toFixed(2)}€</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          i % 2 === 0
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {i % 2 === 0 ? "En stock" : "Stock faible"}
                        </span>
                        <span className="text-gray-600">Stock: {i * 5}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
