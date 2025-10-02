import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/lib/db";
import { IMenu } from "@/types/menu";
import { Ellipsis } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const AdminPage = () => {
    const [menus, setMenus] = useState<IMenu[]>([]);

    useEffect(() => {
        const fetchMenu = async () => {
            const { data, error } = await supabase.from("menus").select("*");

            if (error) console.error('error fetchMenu', error)
            else setMenus(data)
        };

        fetchMenu()
    }, [supabase]);

    return (
        <div className="container mx-auto py-8">
            <div className="mb-4 w-full flex justify-between">
                <div className="text-3xl font-bold">Menu</div>
                <Button className="font-bold">Add Menu</Button>
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
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem>Update</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-400">Delete</DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default AdminPage