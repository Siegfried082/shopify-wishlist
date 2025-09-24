import {
  Page,
  Layout,
  Card,
  ResourceList,
  ResourceItem,
  Thumbnail,
  TextContainer,
  Heading,
  Filters,
  TextField,
  Button,
  Badge,
  Stack,
  Modal,
  TextStyle,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useEffect, useCallback } from "react";

export default function WishlistsPage() {
  const [wishlists, setWishlists] = useState([]);
  const [filteredWishlists, setFilteredWishlists] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const [modalActive, setModalActive] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const mockData = [
      {
        id: "1",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        itemCount: 5,
        lastUpdated: "2024-01-15",
        items: [
          {
            id: "prod-1",
            title: "Wireless Headphones",
            image: "https://via.placeholder.com/60",
            price: "$99.99",
            addedAt: "2024-01-10",
          },
          {
            id: "prod-2", 
            title: "Smartphone Case",
            image: "https://via.placeholder.com/60",
            price: "$29.99",
            addedAt: "2024-01-12",
          },
        ],
      },
      {
        id: "2",
        customerName: "Jane Smith",
        customerEmail: "jane@example.com", 
        itemCount: 3,
        lastUpdated: "2024-01-14",
        items: [
          {
            id: "prod-3",
            title: "Running Shoes",
            image: "https://via.placeholder.com/60",
            price: "$129.99",
            addedAt: "2024-01-08",
          },
        ],
      },
      {
        id: "3",
        customerName: "Guest User",
        customerEmail: "guest@session.local",
        itemCount: 2,
        lastUpdated: "2024-01-16",
        items: [
          {
            id: "prod-4",
            title: "Coffee Mug",
            image: "https://via.placeholder.com/60", 
            price: "$19.99",
            addedAt: "2024-01-16",
          },
        ],
      },
    ];
    
    setWishlists(mockData);
    setFilteredWishlists(mockData);
    setLoading(false);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchValue(value);
    const filtered = wishlists.filter((wishlist) =>
      wishlist.customerName.toLowerCase().includes(value.toLowerCase()) ||
      wishlist.customerEmail.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredWishlists(filtered);
  }, [wishlists]);

  const handleClearFilters = useCallback(() => {
    setSearchValue("");
    setFilteredWishlists(wishlists);
  }, [wishlists]);

  const viewWishlistDetails = (wishlist) => {
    setSelectedWishlist(wishlist);
    setModalActive(true);
  };

  const filters = [
    {
      key: "search",
      label: "Search customers",
      filter: (
        <TextField
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search by name or email"
          clearButton
          onClearButtonClick={handleClearFilters}
        />
      ),
    },
  ];

  const renderWishlistItem = useCallback((wishlist) => {
    const { id, customerName, customerEmail, itemCount, lastUpdated } = wishlist;
    const isGuest = customerEmail.includes("@session.local");

    return (
      <ResourceItem
        id={id}
        onClick={() => viewWishlistDetails(wishlist)}
        accessibilityLabel={`View wishlist for ${customerName}`}
      >
        <Stack alignment="center">
          <Stack.Item fill>
            <TextContainer>
              <Heading>{customerName}</Heading>
              <p>{customerEmail}</p>
            </TextContainer>
          </Stack.Item>
          <Stack.Item>
            <Badge status={isGuest ? "info" : "success"}>
              {isGuest ? "Guest" : "Registered"}
            </Badge>
          </Stack.Item>
          <Stack.Item>
            <TextContainer spacing="tight">
              <p><strong>{itemCount}</strong> items</p>
              <TextStyle variation="subdued">Updated {lastUpdated}</TextStyle>
            </TextContainer>
          </Stack.Item>
        </Stack>
      </ResourceItem>
    );
  }, []);

  return (
    <Page>
      <TitleBar title="Customer Wishlists" />
      <Layout>
        <Layout.Section>
          <Card>
            <ResourceList
              resourceName={{ singular: "wishlist", plural: "wishlists" }}
              items={filteredWishlists}
              renderItem={renderWishlistItem}
              loading={loading}
              filters={filters}
              onFiltersChange={() => {}}
              totalItemsCount={filteredWishlists.length}
              emptyState={
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <Heading>No wishlists found</Heading>
                  <p>No customers have created wishlists yet.</p>
                </div>
              }
            />
          </Card>
        </Layout.Section>
      </Layout>

      {/* Wishlist Detail Modal */}
      <Modal
        open={modalActive}
        onClose={() => setModalActive(false)}
        title={selectedWishlist ? `${selectedWishlist.customerName}'s Wishlist` : ""}
        primaryAction={{
          content: "Close",
          onAction: () => setModalActive(false),
        }}
      >
        {selectedWishlist && (
          <Modal.Section>
            <Stack vertical spacing="loose">
              <TextContainer>
                <p><strong>Customer:</strong> {selectedWishlist.customerName}</p>
                <p><strong>Email:</strong> {selectedWishlist.customerEmail}</p>
                <p><strong>Items:</strong> {selectedWishlist.itemCount}</p>
                <p><strong>Last Updated:</strong> {selectedWishlist.lastUpdated}</p>
              </TextContainer>

              <Heading>Wishlist Items</Heading>
              
              {selectedWishlist.items.map((item) => (
                <Card key={item.id} sectioned>
                  <Stack alignment="center">
                    <Thumbnail source={item.image} alt={item.title} size="small" />
                    <Stack.Item fill>
                      <TextContainer>
                        <Heading>{item.title}</Heading>
                        <p><strong>{item.price}</strong></p>
                        <TextStyle variation="subdued">Added {item.addedAt}</TextStyle>
                      </TextContainer>
                    </Stack.Item>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Modal.Section>
        )}
      </Modal>
    </Page>
  );
}