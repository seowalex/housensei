export enum EventCategory {
  Heatmap = 'Heatmap',
  History = 'History',
  Grant = 'Grant',
}

export enum HeatmapEventAction {
  EditPrice = 'Editted price range',
  AdjustYear = 'Adjusted year',
  SearchAddr = 'Searched for an address',
  ViewTown = 'Entered town view',
  ViewIsland = 'Entered island view',
  ChangeTown = 'Changed Town/Island',
  ToggleHeatMap = 'Toggled heatmap',
  ToggleTown = 'Toggled towns/prices',
  ViewBlock = 'View all transactions in a particular block',
  AddToPriceHistory = 'Add to price history chart',
}

export enum HistoryEventAction {
  AddResale = 'Added Resale Group',
  AddBTO = 'Added BTO Group',
  AddBTOProjects = 'Added related BTO projects from Resale Group',
  SearchListings = 'Search listings',
}

export enum GrantEventAction {}
