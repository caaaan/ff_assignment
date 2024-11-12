import React, { useState, useEffect, useMemo } from 'react'
import { useTable, useFilters, useSortBy, Column } from 'react-table'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, Loader2, XCircle, Trash2 } from 'lucide-react'

import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next';
//import jwt from 'jsonwebtoken';

interface Player {
  id: number
  player: string
  dribbleSkills: number
  length: number
  weight: number
  age: number
  ballControl: number
  passingUnderPressure: number
  team: string
  position: string
}



export default function PlayerTable() {
  
  //const isAuthenticated = useAuth(); // assuming it returns true if authenticated
  //const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
/*
    useEffect(() => {
        const checkAuth = async () => {
            const response = await fetch('/players', {
                method: 'GET',
                credentials: 'include', // Important: allows cookies to be sent
            });

            if (response.ok) {
                setIsAuthenticated(true);
            } else {
                router.push('/login'); // Redirect to login if not authenticated
            }
        };

        checkAuth();
    }, [router]);
*/



  //if (!isAuthenticated) return null; // Optionally, add a loading spinner or similar placeholder

  const [players, setPlayers] = useState<Player[]>([])
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false)
  const [newPlayer, setNewPlayer] = useState<Omit<Player, 'id'>>({
    player: '',
    dribbleSkills: 0,
    length: 0,
    weight: 0,
    age: 0,
    ballControl: 0,
    passingUnderPressure: 0,
    team: '',
    position: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fetchPlayers = async () => {
    try {
      //const token = document.cookie.split('; ').find(row => row.startsWith('token='));
     
      const response = await fetch('http://localhost:3001/players', {
        method: "GET",
        headers: {
         // "credentials": `include`,
          "Content-Type": "application/json",
        },
      })
      if (!response.ok) {
        console.error("response not ok")
        console.log(response)
        throw new Error('Failed to fetch players')
      }
      const data = await response.json()
      setPlayers(data)
      console.log('executes')
      console.log(data)
    } catch (error) {
      console.error('Error fetching players:', error)
      setErrorMessage("Failed to fetch players. Please try again later.")
    }
  }

  useEffect(() => {
    fetchPlayers()
  }, [])

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  const columns = useMemo<Column<Player>[]>(
    () => [
      { Header: 'Player', accessor: 'player' },
      { Header: 'Dribble Skills', accessor: 'dribbleSkills' },
      { Header: 'Length', accessor: 'length' },
      { Header: 'Weight', accessor: 'weight' },
      { Header: 'Age', accessor: 'age' },
      { Header: 'Ball Control', accessor: 'ballControl' },
      { Header: 'Passing Under Pressure', accessor: 'passingUnderPressure' },
      { Header: 'Team', accessor: 'team' },
      { Header: 'Position', accessor: 'position' },
      {
        Header: '',
        id: 'delete',
        Cell: ({ row }: { row: any }) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeletePlayer(row.original.player)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: players,
      initialState: {
        sortBy: [{ id: 'player', desc: false }] as Array<{ id: string; desc: boolean }>
      } as any
    },
    useFilters,
    useSortBy
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewPlayer(prev => ({ ...prev, [name]: name === 'player' || name === 'team' || name === 'position' ? value : Number(value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:3001/player/create', {
        method: 'POST',
        headers: {
          credentials: 'include',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlayer),
      })
      if (!response.ok) {
        throw new Error('Failed to add player')
      }
      
      await fetchPlayers()
      
      setIsAddPlayerOpen(false)
      setNewPlayer({
        player: '',
        dribbleSkills: 0,
        length: 0,
        weight: 0,
        age: 0,
        ballControl: 0,
        passingUnderPressure: 0,
        team: '',
        position: '',
      })
    } catch (error) {
      console.error('Error adding player:', error)
      setErrorMessage("An error has occurred. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePlayer = async (playerName: string) => {
    try {
      const response = await fetch('http://localhost:3001/players', {
        method: 'DELETE',
        headers: {
          credentials: 'include',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ player: playerName }),
      })
      if (!response.ok) {
        throw new Error('Failed to delete player')
      }
      await fetchPlayers()
    } catch (error) {
      console.error('Error deleting player:', error)
      setErrorMessage("Failed to delete player. Please try again later.")
    }
  }

  return (
    <div className="container mx-auto p-4 relative">
      <Table {...getTableProps()} className="w-full">
        <TableHeader>
          {headerGroups.map((headerGroup: any) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <TableHead {...column.getHeaderProps(column.getSortByToggleProps())} className="cursor-pointer">
                  <div className="flex items-center">
                    {column.render('Header')}
                    <span className="ml-2">
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <ChevronDownIcon className="h-4 w-4" />
                        ) : (
                          <ChevronUpIcon className="h-4 w-4" />
                        )
                      ) : (
                        <ChevronsUpDownIcon className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                      )}
                    </span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()} className="group">
                {row.cells.map(cell => (
                  <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Dialog open={isAddPlayerOpen} onOpenChange={setIsAddPlayerOpen}>
        <DialogTrigger asChild>
          <Button className="mt-4 w-full">Add Player</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Player</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(newPlayer).map(key => (
              <div key={key}>
                <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                <Input
                  id={key}
                  name={key}
                  value={newPlayer[key as keyof typeof newPlayer]}
                  onChange={handleInputChange}
                  required
                  type={key === 'player' || key === 'team' || key === 'position' ? 'text' : 'number'}
                />
              </div>
            ))}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Player'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}

      {errorMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-red-500 text-white p-4 rounded-md shadow-lg flex items-center">
            <XCircle className="h-5 w-5 mr-2" />
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  )
}