import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Sun, Cloud, CloudRain, Share2, Search, Save, Sparkles, X, BarChart3, Shirt } from 'lucide-react';

// Mock ML functions
const extractDominantColor = (imageUrl) => {
  const colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Gray', 'Brown', 'Navy', 'Pink', 'Yellow'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const classifyStyle = (category) => {
  const styles = {
    'Tops': ['Casual', 'Formal', 'Business Casual'],
    'Bottoms': ['Casual', 'Formal', 'Athletic'],
    'Shoes': ['Casual', 'Formal', 'Athletic', 'Boots'],
    'Accessories': ['Casual', 'Formal', 'Statement']
  };
  const categoryStyles = styles[category] || ['Casual'];
  return categoryStyles[Math.floor(Math.random() * categoryStyles.length)];
};

const calculateCompatibilityScore = (items) => {
  return Math.floor(Math.random() * 30) + 70;
};

const VirtualWardrobe = () => {
  const [activeTab, setActiveTab] = useState('wardrobe');
  const [items, setItems] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSeason, setFilterSeason] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOutfitModal, setShowOutfitModal] = useState(false);
  const [weather, setWeather] = useState({ temp: 72, condition: 'Sunny' });
  const [outfitCalendar, setOutfitCalendar] = useState({});
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Tops',
    color: '',
    season: 'All-Season',
    formality: 'Casual',
    brand: '',
    imageUrl: ''
  });
  const [newOutfit, setNewOutfit] = useState({
    name: '',
    occasion: 'Casual',
    items: []
  });

  // Initialize with sample data
  useEffect(() => {
    const sampleItems = [
      { id: 1, name: 'White T-Shirt', category: 'Tops', color: 'White', season: 'All-Season', formality: 'Casual', brand: 'Nike', wearCount: 15, imageUrl: '👕', style: 'Casual' },
      { id: 2, name: 'Blue Jeans', category: 'Bottoms', color: 'Blue', season: 'All-Season', formality: 'Casual', brand: "Levi's", wearCount: 20, imageUrl: '👖', style: 'Casual' },
      { id: 3, name: 'Black Blazer', category: 'Tops', color: 'Black', season: 'Fall', formality: 'Formal', brand: 'Hugo Boss', wearCount: 5, imageUrl: '🧥', style: 'Formal' },
      { id: 4, name: 'Sneakers', category: 'Shoes', color: 'White', season: 'All-Season', formality: 'Casual', brand: 'Adidas', wearCount: 30, imageUrl: '👟', style: 'Athletic' },
      { id: 5, name: 'Leather Shoes', category: 'Shoes', color: 'Brown', season: 'All-Season', formality: 'Formal', brand: 'Clarks', wearCount: 8, imageUrl: '👞', style: 'Formal' },
    ];
    setItems(sampleItems);

    const sampleOutfits = [
      { id: 1, name: 'Casual Friday', occasion: 'Work', items: [1, 2, 4], saved: true, compatibility: 85 },
      { id: 2, name: 'Date Night', occasion: 'Formal', items: [3, 2, 5], saved: true, compatibility: 92 }
    ];
    setOutfits(sampleOutfits);
  }, []);

  // Weather simulation
  useEffect(() => {
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Cold'];
    const temps = [45, 60, 72, 85];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const randomTemp = temps[Math.floor(Math.random() * temps.length)];
    setWeather({ temp: randomTemp, condition: randomCondition });
  }, []);

  const addItem = () => {
    if (!newItem.name) return;
    
    const item = {
      id: Date.now(),
      ...newItem,
      color: newItem.color || extractDominantColor(newItem.imageUrl),
      style: classifyStyle(newItem.category),
      wearCount: 0,
      imageUrl: newItem.imageUrl || '👔'
    };
    
    setItems([...items, item]);
    setNewItem({
      name: '',
      category: 'Tops',
      color: '',
      season: 'All-Season',
      formality: 'Casual',
      brand: '',
      imageUrl: ''
    });
    setShowAddModal(false);
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    setSelectedItems(selectedItems.filter(itemId => itemId !== id));
  };

  const toggleItemSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const createOutfit = () => {
    if (selectedItems.length === 0 || !newOutfit.name) return;
    
    const outfit = {
      id: Date.now(),
      name: newOutfit.name,
      occasion: newOutfit.occasion,
      items: [...selectedItems],
      saved: true,
      compatibility: calculateCompatibilityScore(selectedItems)
    };
    
    setOutfits([...outfits, outfit]);
    setSelectedItems([]);
    setNewOutfit({ name: '', occasion: 'Casual', items: [] });
    setShowOutfitModal(false);
  };

  const scheduleOutfit = (outfitId, date) => {
    setOutfitCalendar({
      ...outfitCalendar,
      [date]: outfitId
    });
  };

  const getWeatherRecommendations = () => {
    const { temp, condition } = weather;
    let recommendations = items.filter(item => {
      if (temp < 60 && (item.category === 'Tops' && item.season === 'Fall')) return true;
      if (temp > 75 && item.season === 'Summer') return true;
      if (condition === 'Rainy' && item.category === 'Shoes' && item.name.includes('Boot')) return true;
      return item.season === 'All-Season';
    });
    return recommendations.slice(0, 4);
  };

  const getUnderutilizedItems = () => {
    return items
      .sort((a, b) => a.wearCount - b.wearCount)
      .slice(0, 5);
  };

  const getMostWornItems = () => {
    return items
      .sort((a, b) => b.wearCount - a.wearCount)
      .slice(0, 5);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    const matchesSeason = filterSeason === 'All' || item.season === filterSeason;
    return matchesSearch && matchesCategory && matchesSeason;
  });

  const categories = ['All', 'Tops', 'Bottoms', 'Shoes', 'Accessories'];
  const seasons = ['All', 'Spring', 'Summer', 'Fall', 'Winter', 'All-Season'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                <Shirt className="text-purple-600" size={40} />
                Virtual Wardrobe
              </h1>
              <p className="text-gray-600 mt-2">Smart clothing organization & styling assistant</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-600">
                  {weather.condition === 'Sunny' && <Sun size={24} />}
                  {weather.condition === 'Cloudy' && <Cloud size={24} />}
                  {weather.condition === 'Rainy' && <CloudRain size={24} />}
                  <div>
                    <div className="font-bold text-2xl">{weather.temp}°F</div>
                    <div className="text-sm">{weather.condition}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6 p-2">
          <div className="flex gap-2 flex-wrap">
            {['wardrobe', 'outfits', 'calendar', 'analytics', 'recommendations'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all min-w-[120px] ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Wardrobe Tab */}
        {activeTab === 'wardrobe' && (
          <div>
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex gap-4 mb-4 flex-wrap">
                <div className="flex-1 relative min-w-[200px]">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 font-semibold"
                >
                  <Plus size={20} />
                  Add Item
                </button>
              </div>
              <div className="flex gap-4 flex-wrap">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <select
                  value={filterSeason}
                  onChange={(e) => setFilterSeason(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {seasons.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl shadow-lg p-4 cursor-pointer transition-all hover:shadow-xl ${
                    selectedItems.includes(item.id) ? 'ring-4 ring-purple-500' : ''
                  }`}
                  onClick={() => toggleItemSelection(item.id)}
                >
                  <div className="text-6xl mb-3 text-center">{item.imageUrl}</div>
                  <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{item.category}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{item.color}</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">{item.style}</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    <div>Brand: {item.brand}</div>
                    <div>Worn: {item.wearCount} times</div>
                    <div>Season: {item.season}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(item.id);
                    }}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              ))}
            </div>

            {selectedItems.length > 0 && (
              <div className="fixed bottom-6 right-6 bg-purple-600 text-white p-4 rounded-xl shadow-2xl z-40">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="font-semibold">{selectedItems.length} items selected</span>
                  <button
                    onClick={() => setShowOutfitModal(true)}
                    className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 font-semibold"
                  >
                    Create Outfit
                  </button>
                  <button
                    onClick={() => setSelectedItems([])}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Outfits Tab */}
        {activeTab === 'outfits' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outfits.map(outfit => (
              <div key={outfit.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800">{outfit.name}</h3>
                    <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded mt-1 inline-block">
                      {outfit.occasion}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    <Sparkles size={16} />
                    <span className="font-semibold">{outfit.compatibility}%</span>
                  </div>
                </div>
                <div className="flex gap-2 mb-4 flex-wrap">
                  {outfit.items.map(itemId => {
                    const item = items.find(i => i.id === itemId);
                    return item ? (
                      <div key={itemId} className="text-4xl">{item.imageUrl}</div>
                    ) : null;
                  })}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2">
                    <Share2 size={16} />
                    Share
                  </button>
                  <button
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      scheduleOutfit(outfit.id, today);
                    }}
                    className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 flex items-center justify-center gap-2"
                  >
                    <Calendar size={16} />
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Outfit Calendar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const dateStr = date.toISOString().split('T')[0];
                const scheduledOutfitId = outfitCalendar[dateStr];
                const scheduledOutfit = outfits.find(o => o.id === scheduledOutfitId);
                
                return (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
                    <div className="font-semibold text-gray-700 mb-2">
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    {scheduledOutfit ? (
                      <div className="bg-purple-100 rounded-lg p-3">
                        <div className="font-semibold text-purple-900 mb-2">{scheduledOutfit.name}</div>
                        <div className="flex gap-1 flex-wrap">
                          {scheduledOutfit.items.slice(0, 3).map(itemId => {
                            const item = items.find(i => i.id === itemId);
                            return item ? <span key={itemId} className="text-2xl">{item.imageUrl}</span> : null;
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">No outfit scheduled</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BarChart3 size={28} />
                Wardrobe Analytics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-blue-600 font-semibold mb-2">Total Items</div>
                  <div className="text-3xl font-bold text-blue-900">{items.length}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-green-600 font-semibold mb-2">Total Outfits</div>
                  <div className="text-3xl font-bold text-green-900">{outfits.length}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-purple-600 font-semibold mb-2">Avg. Compatibility</div>
                  <div className="text-3xl font-bold text-purple-900">
                    {outfits.length > 0 ? Math.round(outfits.reduce((sum, o) => sum + o.compatibility, 0) / outfits.length) : 0}%
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Most Worn Items</h3>
                <div className="space-y-3">
                  {getMostWornItems().map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{item.imageUrl}</span>
                        <div>
                          <div className="font-semibold text-gray-800">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.category}</div>
                        </div>
                      </div>
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                        {item.wearCount}x
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Underutilized Items</h3>
                <div className="space-y-3">
                  {getUnderutilizedItems().map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{item.imageUrl}</span>
                        <div>
                          <div className="font-semibold text-gray-800">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.category}</div>
                        </div>
                      </div>
                      <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">
                        {item.wearCount}x
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles size={28} className="text-purple-600" />
                Smart Recommendations
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  {weather.condition === 'Sunny' && <Sun size={24} className="text-yellow-500" />}
                  {weather.condition === 'Cloudy' && <Cloud size={24} className="text-gray-500" />}
                  {weather.condition === 'Rainy' && <CloudRain size={24} className="text-blue-500" />}
                  <span className="font-semibold text-gray-800">Today's Weather: {weather.temp}°F, {weather.condition}</span>
                </div>
                <p className="text-gray-700">Here are items perfect for today's weather:</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {getWeatherRecommendations().map(item => (
                  <div key={item.id} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-md p-4">
                    <div className="text-5xl mb-3 text-center">{item.imageUrl}</div>
                    <h3 className="font-bold text-gray-800 text-center mb-2">{item.name}</h3>
                    <div className="flex flex-wrap gap-1 justify-center">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{item.category}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{item.season}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Add New Item</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Tops">Tops</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Accessories">Accessories</option>
                </select>
                <input
                  type="text"
                  placeholder="Color"
                  value={newItem.color}
                  onChange={(e) => setNewItem({...newItem, color: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={newItem.season}
                  onChange={(e) => setNewItem({...newItem, season: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Fall">Fall</option>
                  <option value="Winter">Winter</option>
                  <option value="All-Season">All-Season</option>
                </select>
                <select
                  value={newItem.formality}
                  onChange={(e) => setNewItem({...newItem, formality: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Casual">Casual</option>
                  <option value="Business Casual">Business Casual</option>
                  <option value="Formal">Formal</option>
                  <option value="Athletic">Athletic</option>
                </select>
                <input
                  type="text"
                  placeholder="Brand"
                  value={newItem.brand}
                  onChange={(e) => setNewItem({...newItem, brand: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="text"
                  placeholder="Image emoji (e.g., 👕, 👖, 👟)"
                  value={newItem.imageUrl}
                  onChange={(e) => setNewItem({...newItem, imageUrl: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={addItem}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Outfit Modal */}
        {showOutfitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create Outfit</h2>
                <button onClick={() => setShowOutfitModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-600 mb-2">Selected Items:</div>
                  <div className="flex gap-2 flex-wrap">
                    {selectedItems.map(itemId => {
                      const item = items.find(i => i.id === itemId);
                      return item ? (
                        <div key={itemId} className="text-4xl">{item.imageUrl}</div>
                      ) : null;
                    })}
                  </div>
                  <div className="mt-3 bg-green-100 text-green-700 px-3 py-2 rounded-lg flex items-center gap-2">
                    <Sparkles size={16} />
                    <span className="font-semibold">Compatibility: {calculateCompatibilityScore(selectedItems)}%</span>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Outfit name"
                  value={newOutfit.name}
                  onChange={(e) => setNewOutfit({...newOutfit, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={newOutfit.occasion}
                  onChange={(e) => setNewOutfit({...newOutfit, occasion: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Casual">Casual</option>
                  <option value="Work">Work</option>
                  <option value="Formal">Formal</option>
                  <option value="Athletic">Athletic</option>
                  <option value="Party">Party</option>
                  <option value="Date">Date</option>
                </select>
                <button
                  onClick={createOutfit}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Save Outfit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualWardrobe;