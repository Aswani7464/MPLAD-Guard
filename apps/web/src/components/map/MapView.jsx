import { useEffect, useMemo, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const MAP_LAYERS = {
  street: {
    name: 'Street',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },

  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  },

  earth: {
    name: 'Esri Earth',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  },

  dark: {
    name: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; OpenStreetMap contributors &copy; CARTO',
  },
}

/* -------------------------------------------------------
   MANUAL MAP LOCATION PICKER
------------------------------------------------------- */

function ManualLocationPicker({
  manualMode,
  onLocationSelected,
}) {
  useMapEvents({
    click(event) {
      if (!manualMode) return

      onLocationSelected({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
        name: 'Manually selected location',
      })
    },
  })

  return null
}

/* -------------------------------------------------------
   MAP CONTROLLER
------------------------------------------------------- */

function MapController({
  projects,
  userLocation,
  selectedLocation,
  fitWorksRequest,
  locateRequest,
  manualLocationRequest,
  searchLocationRequest,
}) {
  const map = useMap()

  useEffect(() => {
    if (!fitWorksRequest) return
    if (projects.length === 0) return

    const bounds = L.latLngBounds(
      projects.map((project) => [
        Number(project.latitude),
        Number(project.longitude),
      ])
    )

    map.fitBounds(bounds, {
      padding: [45, 45],
      maxZoom: 15,
      animate: true,
    })
  }, [fitWorksRequest, projects, map])

  useEffect(() => {
    if (!locateRequest || !userLocation) return

    map.flyTo(
      [
        userLocation.latitude,
        userLocation.longitude,
      ],
      16,
      {
        animate: true,
        duration: 1.2,
      }
    )
  }, [locateRequest, userLocation, map])

  useEffect(() => {
    if (
      !manualLocationRequest ||
      !selectedLocation
    ) {
      return
    }

    map.flyTo(
      [
        selectedLocation.latitude,
        selectedLocation.longitude,
      ],
      16,
      {
        animate: true,
        duration: 1.2,
      }
    )
  }, [
    manualLocationRequest,
    selectedLocation,
    map,
  ])

  useEffect(() => {
    if (
      !searchLocationRequest ||
      !selectedLocation
    ) {
      return
    }

    map.flyTo(
      [
        selectedLocation.latitude,
        selectedLocation.longitude,
      ],
      15,
      {
        animate: true,
        duration: 1.2,
      }
    )
  }, [
    searchLocationRequest,
    selectedLocation,
    map,
  ])

  return null
}

/* -------------------------------------------------------
   MAIN MAP VIEW
------------------------------------------------------- */

function MapView({
  projects = [],
  center = [20.5937, 78.9629],
  zoom = 5,
}) {
  const [mapType, setMapType] = useState('street')

  const [showAllWorks, setShowAllWorks] =
    useState(true)

  const [userLocation, setUserLocation] =
    useState(null)

  const [selectedLocation, setSelectedLocation] =
    useState(null)

  const [manualMode, setManualMode] =
    useState(false)

  const [locationLoading, setLocationLoading] =
    useState(false)

  const [locationError, setLocationError] =
    useState('')

  const [fitWorksRequest, setFitWorksRequest] =
    useState(0)

  const [locateRequest, setLocateRequest] =
    useState(0)

  const [
    manualLocationRequest,
    setManualLocationRequest,
  ] = useState(0)

  const [
    searchLocationRequest,
    setSearchLocationRequest,
  ] = useState(0)

  /* SEARCH STATES */

  const [searchText, setSearchText] =
    useState('')

  const [searchResults, setSearchResults] =
    useState([])

  const [searchLoading, setSearchLoading] =
    useState(false)

  const [searchError, setSearchError] =
    useState('')

  const validProjects = useMemo(() => {
    return projects.filter(
      (project) =>
        Number.isFinite(
          Number(project.latitude)
        ) &&
        Number.isFinite(
          Number(project.longitude)
        )
    )
  }, [projects])

  /* -------------------------------------------------------
     GPS
  ------------------------------------------------------- */

  const locateMyGPS = () => {
    if (!navigator.geolocation) {
      setLocationError(
        'Geolocation is not supported by this browser.'
      )
      return
    }

    setLocationLoading(true)
    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude:
            position.coords.latitude,

          longitude:
            position.coords.longitude,

          accuracy:
            position.coords.accuracy,

          name: 'My Current Location',
        }

        setUserLocation(location)
        setLocationLoading(false)

        setLocateRequest(
          (value) => value + 1
        )
      },

      (error) => {
        setLocationLoading(false)

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          setLocationError(
            'Location permission was denied. Please allow GPS access.'
          )
        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          setLocationError(
            'Your current location is unavailable.'
          )
        } else if (
          error.code === error.TIMEOUT
        ) {
          setLocationError(
            'GPS request timed out. Please try again.'
          )
        } else {
          setLocationError(
            'Unable to determine your current location.'
          )
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    )
  }

  /* -------------------------------------------------------
     MANUAL LOCATION
  ------------------------------------------------------- */

  const enableManualLocation = () => {
    setManualMode(true)
    setLocationError('')
    setSelectedLocation(null)
    setSearchResults([])
  }

  const handleManualLocation = (
    location
  ) => {
    setSelectedLocation(location)
    setManualMode(false)

    setManualLocationRequest(
      (value) => value + 1
    )
  }

  const clearSelectedLocation = () => {
    setSelectedLocation(null)
    setManualMode(false)
  }

  /* -------------------------------------------------------
     SEARCH LOCATION
     Uses OpenStreetMap Nominatim
  ------------------------------------------------------- */

  const searchLocation = async () => {
    const query = searchText.trim()

    if (!query) {
      setSearchError(
        'Please enter a location to search.'
      )
      return
    }

    setSearchLoading(true)
    setSearchError('')
    setSearchResults([])

    try {
      const response =
        await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(
            query
          )}`,
          {
            headers: {
              Accept:
                'application/json',
            },
          }
        )

      if (!response.ok) {
        throw new Error(
          'Location search failed.'
        )
      }

      const data =
        await response.json()

      if (!data.length) {
        setSearchError(
          'No location found. Try another name.'
        )
        setSearchLoading(false)
        return
      }

      setSearchResults(data)
    } catch (error) {
      setSearchError(
        'Unable to search location. Please check your internet connection and try again.'
      )
    } finally {
      setSearchLoading(false)
    }
  }

  /* -------------------------------------------------------
     SELECT SEARCH RESULT
  ------------------------------------------------------- */

  const selectSearchResult = (
    result
  ) => {
    const latitude =
      Number(result.lat)

    const longitude =
      Number(result.lon)

    const locationName =
      result.display_name ||
      searchText

    const location = {
      latitude,
      longitude,
      name: locationName,
    }

    setSelectedLocation(location)

    setSearchResults([])
    setSearchError('')

    setSearchLocationRequest(
      (value) => value + 1
    )
  }

  /* -------------------------------------------------------
     SEARCH USING ENTER
  ------------------------------------------------------- */

  const handleSearchKeyDown = (
    event
  ) => {
    if (event.key === 'Enter') {
      searchLocation()
    }
  }

  /* -------------------------------------------------------
     FIT WORKS
  ------------------------------------------------------- */

  const fitAllWorks = () => {
    if (validProjects.length === 0) return

    setFitWorksRequest(
      (value) => value + 1
    )
  }

  return (
    <>
      <style>
        {`
          .professional-map {
            width: 100%;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08);
          }

          .map-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            padding: 18px 22px;
            background: #ffffff;
            border-bottom: 1px solid #e5e7eb;
          }

          .map-toolbar-title {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .map-toolbar-title strong {
            display: block;
            font-size: 16px;
            font-weight: 700;
            color: #111827;
          }

          .map-toolbar-title small {
            display: block;
            margin-top: 3px;
            font-size: 12px;
            color: #6b7280;
          }

          .map-toolbar-icon {
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 11px;
            background: #eef2ff;
            color: #4f46e5;
            font-size: 19px;
          }

          .map-layer-buttons {
            display: flex;
            align-items: center;
            gap: 7px;
            padding: 5px;
            background: #f3f4f6;
            border-radius: 12px;
          }

          .map-layer-button {
            border: 0;
            background: transparent;
            color: #6b7280;
            padding: 9px 13px;
            border-radius: 9px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s ease;
          }

          .map-layer-button:hover {
            background: #ffffff;
            color: #374151;
          }

          .map-layer-button.active {
            background: #ffffff;
            color: #4338ca;
            box-shadow: 0 2px 7px rgba(15, 23, 42, 0.10);
          }

          /* SEARCH BAR */

          .map-search-section {
            position: relative;
            padding: 14px 18px;
            background: #ffffff;
            border-bottom: 1px solid #e5e7eb;
          }

          .map-search-box {
            display: flex;
            align-items: center;
            gap: 9px;
            width: 100%;
          }

          .map-search-input-wrapper {
            display: flex;
            align-items: center;
            flex: 1;
            min-width: 0;
            border: 1px solid #d1d5db;
            border-radius: 11px;
            background: #ffffff;
            transition: all 0.2s ease;
          }

          .map-search-input-wrapper:focus-within {
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.10);
          }

          .map-search-icon {
            padding-left: 13px;
            font-size: 16px;
          }

          .map-search-input {
            width: 100%;
            border: 0;
            outline: none;
            padding: 11px 12px;
            font-size: 13px;
            color: #111827;
            background: transparent;
          }

          .map-search-input::placeholder {
            color: #9ca3af;
          }

          .map-search-button {
            border: 0;
            border-radius: 10px;
            padding: 11px 18px;
            background: #4f46e5;
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .map-search-button:hover:not(:disabled) {
            background: #4338ca;
            transform: translateY(-1px);
          }

          .map-search-button:disabled {
            opacity: 0.55;
            cursor: not-allowed;
          }

          .map-search-results {
            position: absolute;
            z-index: 1000;
            left: 18px;
            right: 18px;
            top: calc(100% - 5px);
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 11px;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.14);
            overflow: hidden;
          }

          .map-search-result {
            width: 100%;
            padding: 12px 14px;
            border: 0;
            border-bottom: 1px solid #f3f4f6;
            background: #ffffff;
            text-align: left;
            cursor: pointer;
            transition: background 0.15s ease;
          }

          .map-search-result:last-child {
            border-bottom: 0;
          }

          .map-search-result:hover {
            background: #f8fafc;
          }

          .map-search-result strong {
            display: block;
            color: #111827;
            font-size: 12px;
            line-height: 1.4;
          }

          .map-search-result small {
            display: block;
            margin-top: 4px;
            color: #9ca3af;
            font-size: 10px;
          }

          .map-search-error {
            margin-top: 7px;
            color: #dc2626;
            font-size: 11px;
          }

          .map-action-bar {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 18px;
            background: #f8fafc;
            border-bottom: 1px solid #e5e7eb;
            flex-wrap: wrap;
          }

          .map-action-button {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 155px;
            padding: 9px 12px;
            border: 1px solid #e5e7eb;
            border-radius: 11px;
            background: #ffffff;
            color: #374151;
            cursor: pointer;
            text-align: left;
            transition: all 0.2s ease;
          }

          .map-action-button:hover:not(:disabled) {
            border-color: #c7d2fe;
            box-shadow: 0 3px 10px rgba(15, 23, 42, 0.08);
            transform: translateY(-1px);
          }

          .map-action-button.active {
            border-color: #c7d2fe;
            background: #eef2ff;
            color: #3730a3;
          }

          .map-action-button:disabled {
            opacity: 0.55;
            cursor: not-allowed;
          }

          .map-action-button > span {
            width: 30px;
            height: 30px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background: #f3f4f6;
            font-size: 14px;
          }

          .map-action-button strong {
            display: block;
            font-size: 12px;
            font-weight: 700;
          }

          .map-action-button small {
            display: block;
            margin-top: 3px;
            font-size: 10px;
            color: #9ca3af;
          }

          .map-work-count {
            margin-left: auto;
            min-width: 100px;
            padding: 7px 14px;
            text-align: center;
            border-left: 1px solid #e5e7eb;
          }

          .map-work-count strong {
            display: block;
            font-size: 18px;
            font-weight: 800;
            color: #111827;
          }

          .map-work-count span {
            display: block;
            margin-top: 2px;
            font-size: 10px;
            font-weight: 600;
            color: #9ca3af;
            text-transform: uppercase;
          }

          .map-location-error {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 12px 18px 0;
            padding: 11px 13px;
            border: 1px solid #fde68a;
            border-radius: 10px;
            background: #fffbeb;
          }

          .map-location-error strong {
            display: block;
            font-size: 12px;
            color: #92400e;
          }

          .map-location-error p {
            margin: 2px 0 0;
            font-size: 11px;
            color: #a16207;
          }

          .map-location-error button {
            margin-left: auto;
            border: 0;
            background: transparent;
            color: #92400e;
            font-size: 18px;
            cursor: pointer;
          }

          .map-manual-hint {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 12px 18px 0;
            padding: 11px 13px;
            border: 1px solid #c7d2fe;
            border-radius: 10px;
            background: #eef2ff;
            color: #3730a3;
          }

          .map-manual-hint strong {
            display: block;
            font-size: 12px;
          }

          .map-manual-hint span {
            display: block;
            margin-top: 2px;
            font-size: 11px;
            color: #6366f1;
          }

          .map-container {
            position: relative;
            width: 100%;
            height: 560px;
            background: #e5e7eb;
          }

          .mplad-map {
            width: 100%;
            height: 100%;
            z-index: 1;
          }

          .map-status-card {
            position: absolute;
            z-index: 500;
            left: 18px;
            bottom: 18px;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 14px;
            min-width: 220px;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(229, 231, 235, 0.95);
            border-radius: 11px;
            box-shadow: 0 5px 18px rgba(15, 23, 42, 0.16);
            backdrop-filter: blur(8px);
          }

          .map-status-indicator {
            width: 9px;
            height: 9px;
            border-radius: 50%;
            background: #22c55e;
          }

          .map-status-card strong {
            display: block;
            font-size: 11px;
            color: #111827;
          }

          .map-status-card span {
            display: block;
            margin-top: 2px;
            font-size: 10px;
            color: #6b7280;
          }

          .map-popup {
            min-width: 235px;
          }

          .map-popup-header {
            display: flex;
            align-items: flex-start;
            gap: 9px;
          }

          .map-popup-icon {
            width: 31px;
            height: 31px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background: #eef2ff;
          }

          .map-popup-header strong {
            display: block;
            font-size: 12px;
            color: #111827;
          }

          .map-popup-header span {
            display: block;
            margin-top: 2px;
            font-size: 10px;
            color: #9ca3af;
          }

          .map-popup-divider {
            height: 1px;
            margin: 10px 0;
            background: #e5e7eb;
          }

          .map-popup-row {
            display: flex;
            justify-content: space-between;
            gap: 15px;
            padding: 4px 0;
          }

          .map-popup-row span {
            color: #9ca3af;
            font-size: 10px;
          }

          .map-popup-row strong {
            max-width: 170px;
            text-align: right;
            color: #374151;
            font-size: 10px;
          }

          @media (max-width: 900px) {
            .map-toolbar {
              align-items: flex-start;
              flex-direction: column;
            }

            .map-layer-buttons {
              width: 100%;
              overflow-x: auto;
            }

            .map-work-count {
              margin-left: 0;
            }
          }

          @media (max-width: 600px) {
            .map-search-box {
              flex-direction: column;
            }

            .map-search-input-wrapper {
              width: 100%;
            }

            .map-search-button {
              width: 100%;
            }

            .map-action-button {
              min-width: 100%;
            }

            .map-container {
              height: 450px;
            }
          }
        `}
      </style>

      <div className="professional-map">

        {/* MAP HEADER */}
        <div className="map-toolbar">

          <div className="map-toolbar-title">

            <span className="map-toolbar-icon">
              ◉
            </span>

            <div>
              <strong>
                Map Views
              </strong>

              <small>
                Monitor MPLAD work sites across India
              </small>
            </div>

          </div>

          {/* MAP LAYERS */}
          <div className="map-layer-buttons">

            {Object.entries(MAP_LAYERS).map(
              ([key, layer]) => (
                <button
                  key={key}
                  type="button"
                  className={
                    mapType === key
                      ? 'map-layer-button active'
                      : 'map-layer-button'
                  }
                  onClick={() =>
                    setMapType(key)
                  }
                >
                  {key === 'street' &&
                    '▣'}

                  {key === 'satellite' &&
                    '▦'}

                  {key === 'earth' &&
                    '🌍'}

                  {key === 'dark' &&
                    '◐'}

                  {layer.name}
                </button>
              )
            )}

          </div>

        </div>

        {/* LOCATION SEARCH */}
        <div className="map-search-section">

          <div className="map-search-box">

            <div className="map-search-input-wrapper">

              <span className="map-search-icon">
                🔎
              </span>

              <input
                type="text"
                className="map-search-input"
                value={searchText}
                onChange={(event) => {
                  setSearchText(
                    event.target.value
                  )
                  setSearchError('')
                }}
                onKeyDown={
                  handleSearchKeyDown
                }
                placeholder="Search location, city, district or place..."
              />

            </div>

            <button
              type="button"
              className="map-search-button"
              onClick={searchLocation}
              disabled={searchLoading}
            >
              {searchLoading
                ? 'Searching...'
                : 'Search Location'}
            </button>

          </div>

          {/* SEARCH RESULTS */}
          {searchResults.length > 0 && (
            <div className="map-search-results">

              {searchResults.map(
                (result, index) => (
                  <button
                    key={
                      result.place_id ||
                      index
                    }
                    type="button"
                    className="map-search-result"
                    onClick={() =>
                      selectSearchResult(
                        result
                      )
                    }
                  >

                    <strong>
                      📍{' '}
                      {result.display_name}
                    </strong>

                    <small>
                      Click to select this
                      location
                    </small>

                  </button>
                )
              )}

            </div>
          )}

          {searchError && (
            <div className="map-search-error">
              {searchError}
            </div>
          )}

        </div>

        {/* ACTION BAR */}
        <div className="map-action-bar">

          {/* ALL WORK SITES */}
          <button
            type="button"
            className={
              showAllWorks
                ? 'map-action-button active'
                : 'map-action-button'
            }
            onClick={() =>
              setShowAllWorks(
                (value) => !value
              )
            }
          >

            <span>
              📍
            </span>

            <div>

              <strong>
                All Work Sites
              </strong>

              <small>
                {validProjects.length}{' '}
                mapped works
              </small>

            </div>

          </button>

          {/* GPS */}
          <button
            type="button"
            className="map-action-button"
            onClick={locateMyGPS}
            disabled={locationLoading}
          >

            <span>
              🎯
            </span>

            <div>

              <strong>
                {locationLoading
                  ? 'Locating...'
                  : 'Locate My GPS'}
              </strong>

              <small>
                Show my current position
              </small>

            </div>

          </button>

          {/* MANUAL LOCATION */}
          <button
            type="button"
            className={
              manualMode
                ? 'map-action-button active'
                : 'map-action-button'
            }
            onClick={
              enableManualLocation
            }
          >

            <span>
              📌
            </span>

            <div>

              <strong>
                {manualMode
                  ? 'Click Map'
                  : 'Set Location'}
              </strong>

              <small>
                {manualMode
                  ? 'Choose a point on map'
                  : 'Set location yourself'}
              </small>

            </div>

          </button>

          {/* CLEAR */}
          {selectedLocation && (
            <button
              type="button"
              className="map-action-button"
              onClick={
                clearSelectedLocation
              }
            >

              <span>
                ✕
              </span>

              <div>

                <strong>
                  Clear Location
                </strong>

                <small>
                  Remove selected point
                </small>

              </div>

            </button>
          )}

          {/* FIT WORKS */}
          <button
            type="button"
            className="map-action-button"
            onClick={fitAllWorks}
            disabled={
              validProjects.length === 0
            }
          >

            <span>
              ⌖
            </span>

            <div>

              <strong>
                Fit Works
              </strong>

              <small>
                Fit all mapped work sites
              </small>

            </div>

          </button>

          <div className="map-work-count">

            <strong>
              {validProjects.length}
            </strong>

            <span>
              Mapped Sites
            </span>

          </div>

        </div>

        {/* MANUAL MODE MESSAGE */}
        {manualMode && (
          <div className="map-manual-hint">

            <span>
              📌
            </span>

            <div>

              <strong>
                Manual Location Mode
              </strong>

              <span>
                Click anywhere on the map to set
                your location.
              </span>

            </div>

          </div>
        )}

        {/* ERROR */}
        {locationError && (
          <div className="map-location-error">

            <span>
              ⚠️
            </span>

            <div>

              <strong>
                Location
              </strong>

              <p>
                {locationError}
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                setLocationError('')
              }
            >
              ×
            </button>

          </div>
        )}

        {/* MAP */}
        <div className="map-container">

          <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            className="mplad-map"
          >

            <TileLayer
              key={mapType}
              url={
                MAP_LAYERS[mapType].url
              }
              attribution={
                MAP_LAYERS[mapType]
                  .attribution
              }
            />

            <MapController
              projects={validProjects}
              userLocation={userLocation}
              selectedLocation={
                selectedLocation
              }
              fitWorksRequest={
                fitWorksRequest
              }
              locateRequest={
                locateRequest
              }
              manualLocationRequest={
                manualLocationRequest
              }
              searchLocationRequest={
                searchLocationRequest
              }
            />

            <ManualLocationPicker
              manualMode={manualMode}
              onLocationSelected={
                handleManualLocation
              }
            />

            {/* PROJECT MARKERS */}
            {showAllWorks &&
              validProjects.map(
                (project) => (
                  <Marker
                    key={project.id}
                    position={[
                      Number(
                        project.latitude
                      ),
                      Number(
                        project.longitude
                      ),
                    ]}
                  >

                    <Popup>

                      <div className="map-popup">

                        <div className="map-popup-header">

                          <span className="map-popup-icon">
                            📍
                          </span>

                          <div>

                            <strong>
                              {project.name ||
                                'MPLAD Work Site'}
                            </strong>

                            <span>
                              Work Site #
                              {project.id}
                            </span>

                          </div>

                        </div>

                        <div className="map-popup-divider" />

                        <div className="map-popup-row">

                          <span>
                            Location
                          </span>

                          <strong>
                            {project.location ||
                              'Location available'}
                          </strong>

                        </div>

                        <div className="map-popup-row">

                          <span>
                            Status
                          </span>

                          <strong>
                            {project.status ||
                              'Not specified'}
                          </strong>

                        </div>

                        <div className="map-popup-row">

                          <span>
                            Progress
                          </span>

                          <strong>
                            {Number(
                              project.completion_percentage ||
                                0
                            )}
                            %
                          </strong>

                        </div>

                        <div className="map-popup-row">

                          <span>
                            Latitude
                          </span>

                          <strong>
                            {Number(
                              project.latitude
                            ).toFixed(6)}
                          </strong>

                        </div>

                        <div className="map-popup-row">

                          <span>
                            Longitude
                          </span>

                          <strong>
                            {Number(
                              project.longitude
                            ).toFixed(6)}
                          </strong>

                        </div>

                      </div>

                    </Popup>

                  </Marker>
                )
              )}

            {/* USER GPS MARKER */}
            {userLocation && (
              <Marker
                position={[
                  userLocation.latitude,
                  userLocation.longitude,
                ]}
              >

                <Popup>

                  <div className="map-popup">

                    <div className="map-popup-header">

                      <span className="map-popup-icon">
                        🎯
                      </span>

                      <div>

                        <strong>
                          Your Current Location
                        </strong>

                        <span>
                          GPS location
                        </span>

                      </div>

                    </div>

                    <div className="map-popup-divider" />

                    <div className="map-popup-row">

                      <span>
                        Latitude
                      </span>

                      <strong>
                        {userLocation.latitude.toFixed(
                          6
                        )}
                      </strong>

                    </div>

                    <div className="map-popup-row">

                      <span>
                        Longitude
                      </span>

                      <strong>
                        {userLocation.longitude.toFixed(
                          6
                        )}
                      </strong>

                    </div>

                    <div className="map-popup-row">

                      <span>
                        Accuracy
                      </span>

                      <strong>
                        {Math.round(
                          userLocation.accuracy
                        )}{' '}
                        m
                      </strong>

                    </div>

                  </div>

                </Popup>

              </Marker>
            )}

            {/* SELECTED LOCATION */}
            {selectedLocation && (
              <Marker
                position={[
                  selectedLocation.latitude,
                  selectedLocation.longitude,
                ]}
              >

                <Popup>

                  <div className="map-popup">

                    <div className="map-popup-header">

                      <span className="map-popup-icon">
                        📌
                      </span>

                      <div>

                        <strong>
                          {selectedLocation.name ||
                            'Selected Location'}
                        </strong>

                        <span>
                          Selected location
                        </span>

                      </div>

                    </div>

                    <div className="map-popup-divider" />

                    <div className="map-popup-row">

                      <span>
                        Latitude
                      </span>

                      <strong>
                        {selectedLocation.latitude.toFixed(
                          6
                        )}
                      </strong>

                    </div>

                    <div className="map-popup-row">

                      <span>
                        Longitude
                      </span>

                      <strong>
                        {selectedLocation.longitude.toFixed(
                          6
                        )}
                      </strong>

                    </div>

                  </div>

                </Popup>

              </Marker>
            )}

          </MapContainer>

          {/* STATUS */}
          <div className="map-status-card">

            <div className="map-status-indicator" />

            <div>

              <strong>
                MPLAD Work Monitoring
              </strong>

              <span>

                {selectedLocation
                  ? selectedLocation.name ||
                    'Location selected'
                  : validProjects.length > 0
                  ? `${validProjects.length} work site${
                      validProjects.length === 1
                        ? ''
                        : 's'
                    } mapped`
                  : 'No work sites with GPS coordinates'}

              </span>

            </div>

          </div>

        </div>

        {/* SELECTED LOCATION DETAILS */}
        {selectedLocation && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(3, minmax(0, 1fr))',
              gap: '12px',
              padding: '14px 18px',
              background: '#ffffff',
              borderTop:
                '1px solid #e5e7eb',
            }}
          >

            <div
              style={{
                padding: '12px 14px',
                border:
                  '1px solid #e5e7eb',
                borderRadius: '10px',
                background: '#f8fafc',
              }}
            >

              <small
                style={{
                  display: 'block',
                  color: '#9ca3af',
                  fontSize: '10px',
                  fontWeight: '600',
                  textTransform:
                    'uppercase',
                }}
              >
                Location
              </small>

              <strong
                style={{
                  display: 'block',
                  marginTop: '4px',
                  color: '#111827',
                  fontSize: '12px',
                }}
              >
                {selectedLocation.name ||
                  'Selected location'}
              </strong>

            </div>

            <div
              style={{
                padding: '12px 14px',
                border:
                  '1px solid #e5e7eb',
                borderRadius: '10px',
                background: '#f8fafc',
              }}
            >

              <small
                style={{
                  display: 'block',
                  color: '#9ca3af',
                  fontSize: '10px',
                  fontWeight: '600',
                  textTransform:
                    'uppercase',
                }}
              >
                Latitude
              </small>

              <strong
                style={{
                  display: 'block',
                  marginTop: '4px',
                  color: '#111827',
                  fontSize: '14px',
                }}
              >
                {selectedLocation.latitude.toFixed(
                  6
                )}
              </strong>

            </div>

            <div
              style={{
                padding: '12px 14px',
                border:
                  '1px solid #e5e7eb',
                borderRadius: '10px',
                background: '#f8fafc',
              }}
            >

              <small
                style={{
                  display: 'block',
                  color: '#9ca3af',
                  fontSize: '10px',
                  fontWeight: '600',
                  textTransform:
                    'uppercase',
                }}
              >
                Longitude
              </small>

              <strong
                style={{
                  display: 'block',
                  marginTop: '4px',
                  color: '#111827',
                  fontSize: '14px',
                }}
              >
                {selectedLocation.longitude.toFixed(
                  6
                )}
              </strong>

            </div>

          </div>
        )}

      </div>
    </>
  )
}

export default MapView