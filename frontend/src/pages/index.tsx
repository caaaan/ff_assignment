import React, { useState, useEffect, useMemo } from 'react'
import { useTable, useFilters, useSortBy, Column } from 'react-table'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon } from 'lucide-react'

interface Player {

  age: number
  ballControl: number
  dribbleSkills: number
  id: number
  length: number
  passingUnderPressure: number
  player: string
  position: string
  team: string
  weight: number
}

export default function PlayerTable() {
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

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // For demonstration, we're using mock data instead of an actual API call
        /*const mockData: Player[] = [
          { id: 1, player: 'John Doe', dribbleSkills: 85, length: 180, weight: 75, age: 25, ballControl: 88, passingUnderPressure: 82, team: 'Team A', position: 'Midfielder' },
          { id: 2, player: 'Jane Smith', dribbleSkills: 78, length: 170, weight: 65, age: 23, ballControl: 85, passingUnderPressure: 80, team: 'Team B', position: 'Forward' },
          { id: 3, player: 'Mike Johnson', dribbleSkills: 92, length: 185, weight: 80, age: 27, ballControl: 90, passingUnderPressure: 88, team: 'Team C', position: 'Defender' },
          { id: 4, player: 'Sarah Williams', dribbleSkills: 88, length: 175, weight: 68, age: 24, ballControl: 87, passingUnderPressure: 85, team: 'Team A', position: 'Midfielder' },
        ]
          */
        const response = await fetch('http://localhost:3002/players');
        const data = await response.json();
        console.log(data);
        const formattedData: Player[] = data.map((item: any): Player => ({
          age: item.age,
          ballControl: item.ballControl,
          dribbleSkills: item.dribbleSkills,
          id: item.id, // Ensure the fetched data has an 'id' field
          length: item.length,
          passingUnderPressure: item.passingUnderPressure,
          player: item.player,
          position: item.position,
          team: item.team,
          weight: item.weight,
        }));
        console.log(formattedData);
        setPlayers(formattedData);
      } catch (error) {
        console.error('Error fetching players:', error)
      }
    }
    fetchPlayers()
  }, [])

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
    try {
      // For demonstration, we're just adding to the local state instead of making an API call
      const addedPlayer: Player = { ...newPlayer, id: players.length + 1 }
      setPlayers(prev => [...prev, addedPlayer])
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
    }
  }

  return (
    <div className="container mx-auto p-4">
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
          {rows.map((row: any) => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell: any) => (
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
            <Button type="submit">Add Player</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}