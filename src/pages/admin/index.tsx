import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/db";
import { IMenu } from "@/types/menu";
import { Label } from "@radix-ui/react-label";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const AdminPage = () => {
    const [menus, setMenus] = useState<IMenu[]>([]);
    const [createDialog, setCreateDialog] = useState(false);
    const [selectMenu, setSelectMenu] = useState<{
        menu: IMenu;
        action: 'edit' | 'delete'
    } | null>(null)

    useEffect(() => {
        const fetchMenu = async () => {
            const { data, error } = await supabase.from("menus").select("*");

            if (error) console.error('error fetchMenu', error)
            else setMenus(data)
        };

        fetchMenu()
    }, [supabase]);

    const handleAddMenu = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        console.log(formData)
        try {
            const { data, error } = await supabase
                .from('menus')
                .insert(Object.fromEntries(formData))
                .select();

            if (error) console.log('error', error)
            else {
                setMenus((prev) => [...data, ...prev])
                toast("Menu Added successfully");
                setCreateDialog(false)
            }

        } catch (error) {
            console.log('error', error)
            toast('something went wrong');
        }
    }

    const handleDelete = async () => {
        try {
            const { data, error } = await supabase
                .from('menus')
                .delete()
                .eq('id', selectMenu?.menu.id);

            if (error) console.log('error', error)
            else {
                setMenus((prev) => prev.filter((menu) => menu.id !== selectMenu?.menu.id))
                toast("Delete Added successfully");
                setSelectMenu(null)
            }

        } catch (error) {
            console.log('error', error)
            toast('something went wrong');
            setSelectMenu(null)
        }
    }
    return (
        <div className="container mx-auto py-8">
            <div className="mb-4 w-full flex justify-between">
                <div className="text-3xl font-bold">Menu</div>
                <Dialog open={createDialog} onOpenChange={setCreateDialog}>
                    <DialogTrigger asChild>
                        <Button className="font-bold">Add Menu</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <form onSubmit={handleAddMenu} className="space-y-4">
                            <DialogHeader>
                                <DialogTitle>Add Menu</DialogTitle>
                                <DialogDescription>Create a new menu by insert data by this form</DialogDescription>
                            </DialogHeader>
                            <div className="grid w-full gap-4">
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Insert Name"
                                        required
                                    />
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        placeholder="Insert Price"
                                        required
                                    />
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="image">Image</Label>
                                    <Input
                                        id="image"
                                        name="image"
                                        placeholder="Insert Image"
                                        required
                                    />
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="category">Catgeory</Label>
                                    <Select required name="category">
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Category</SelectLabel>
                                                <SelectItem value="Foods">Foods</SelectItem>
                                                <SelectItem value="Drink">Drink</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid w-full gap-1.5">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Insert Description"
                                        required
                                        className="resize-none h-32"
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <DialogClose>
                                    <Button variant="secondary" className="cursor-pointer">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" className="cursor-pointer">Submit</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-neutral-700 font-bold">Product</TableHead>
                            <TableHead className="text-neutral-700 font-bold">Description</TableHead>
                            <TableHead className="text-neutral-700 font-bold">Category</TableHead>
                            <TableHead className="text-neutral-700 font-bold">Price</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {menus.map((menu: IMenu) => (
                            <TableRow key={menu.id}>
                                <TableCell className="flex gap-3 items-center w-full">
                                    <Image
                                        width={50}
                                        height={50}
                                        src={menu.image}
                                        alt={menu.name}
                                        className="aspect-square object-cover rounded-lg"
                                    />
                                    {menu.name}
                                </TableCell>
                                <TableCell>{menu.description.split(' ').slice(0, 5).join(' ') + '...'}</TableCell>
                                <TableCell>{menu.category}</TableCell>
                                <TableCell>Rp{menu.price}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild className="cursor-pointer">
                                            <Ellipsis></Ellipsis>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuLabel className="font-bold">
                                                Action
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>Update</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-400" onClick={() => setSelectMenu({ menu, action: 'delete' })}>Delete</DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Dialog open={selectMenu !== null && selectMenu.action === 'delete'}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectMenu(null)
                    }
                }}>

                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Menu</DialogTitle>
                        <DialogDescription>Are you sure want to delete {selectMenu?.menu.name}</DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <DialogClose>
                            <Button variant="secondary" className="cursor-pointer">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleDelete} variant='destructive' className="cursor-pointer">Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AdminPage