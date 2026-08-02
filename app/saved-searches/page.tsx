"use client";

import * as React from "react";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/shared/section";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { SavedSearchCard } from "@/components/saved-searches/saved-search-card";
import { RecentSearchesList } from "@/components/saved-searches/recent-searches-list";
import { SavedSearch, SavedSearchService } from "@/services/saved-searches";
import { Bookmark } from "lucide-react";

export default function SavedSearchesPage() {
  const [savedSearches, setSavedSearches] = React.useState<SavedSearch[]>([]);

  const refreshList = React.useCallback(() => {
    setSavedSearches(SavedSearchService.getSavedSearches());
  }, []);

  React.useEffect(() => {
    refreshList();
  }, [refreshList]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1" data-no-intercept="true">
        <Section className="bg-background relative overflow-hidden text-left pt-6 pb-20">
          <Container className="space-y-8">
            <PageHeader
              title="Saved Searches"
              subtitle="Quickly revisit your saved PG, hostel, and apartment search filter preferences."
              backFallbackUrl="/profile"
            />

            {savedSearches.length === 0 ? (
              <EmptyState
                icon={Bookmark}
                title="No Saved Searches yet"
                description="Save your preferred budget, location, and amenity filters while searching to access them instantly anytime."
                primaryAction={{
                  label: "Explore Properties",
                  href: "/search",
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedSearches.map((search) => (
                  <SavedSearchCard key={search.id} search={search} onUpdate={refreshList} />
                ))}
              </div>
            )}

            {/* Search History Section */}
            <RecentSearchesList onSaveSuccess={refreshList} />
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
