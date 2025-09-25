import { Page, Layout, Card, Heading, TextContainer, DisplayText, TextStyle } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWishlists: 0,
    totalWishlistItems: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setStats({
      totalUsers: 1542,
      totalWishlists: 987,
      totalWishlistItems: 4523,
      activeUsers: 234,
    });
  }, []);

  return (
    <Page>
      <TitleBar title="Wishlist App Dashboard" />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Heading>Welcome to Wishlist App</Heading>
            <TextContainer>
              <p>
                Manage your store's wishlist functionality from this dashboard. 
                View customer wishlists, configure app settings, and monitor usage statistics.
              </p>
            </TextContainer>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Layout>
            <Layout.Section oneHalf>
              <Card sectioned>
                <DisplayText size="medium">{stats.totalUsers.toLocaleString()}</DisplayText>
                <TextStyle variation="subdued">Total Users</TextStyle>
              </Card>
            </Layout.Section>
            <Layout.Section oneHalf>
              <Card sectioned>
                <DisplayText size="medium">{stats.totalWishlists.toLocaleString()}</DisplayText>
                <TextStyle variation="subdued">Active Wishlists</TextStyle>
              </Card>
            </Layout.Section>
          </Layout>
        </Layout.Section>

        <Layout.Section>
          <Layout>
            <Layout.Section oneHalf>
              <Card sectioned>
                <DisplayText size="medium">{stats.totalWishlistItems.toLocaleString()}</DisplayText>
                <TextStyle variation="subdued">Total Wishlist Items</TextStyle>
              </Card>
            </Layout.Section>
            <Layout.Section oneHalf>
              <Card sectioned>
                <DisplayText size="medium">{stats.activeUsers.toLocaleString()}</DisplayText>
                <TextStyle variation="subdued">Active Users (30 days)</TextStyle>
              </Card>
            </Layout.Section>
          </Layout>
        </Layout.Section>
      </Layout>
    </Page>
  );
}