import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { HelmetProvider } from 'react-helmet-async';
import Index from "./pages/Index";
import { Generator } from "./pages/Generator";
import { SharedPage } from "./pages/SharedPage";
import { About } from "./pages/About";
import { Documentation } from "./pages/Documentation";
import { Help } from "./pages/Help";
import { ContactAdmin } from "./pages/ContactAdmin";
import NotFound from "./pages/NotFound";


const queryClient = new QueryClient();

const AppContent = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/shared/:shareId" element={<SharedPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/help" element={<Help />} />
        <Route path="/admin/contacts" element={<ContactAdmin />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
