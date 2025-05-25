import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { HelmetProvider } from 'react-helmet-async';
import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import Index from "./pages/Index";
import { Generator } from "./pages/Generator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <IconButton
      onClick={toggleTheme}
      sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}
      color="inherit"
    >
      {isDarkMode ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};

const AppContent = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <ThemeToggle />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/generator" element={<Generator />} />
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
