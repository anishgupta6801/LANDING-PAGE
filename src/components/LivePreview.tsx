
import React from 'react';
import { useStore } from '../stores/useStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Tablet, Smartphone, Palette, Sun, Moon, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: React.ComponentType<{ className?: string }> } = {
    Zap: ({ className }) => <div className={`${className} text-yellow-500`}>⚡</div>,
    Shield: ({ className }) => <div className={`${className} text-blue-500`}>🛡️</div>,
    Rocket: ({ className }) => <div className={`${className} text-purple-500`}>🚀</div>,
    Star: ({ className }) => <div className={`${className} text-orange-500`}>⭐</div>,
    CheckCircle: ({ className }) => <div className={`${className} text-green-500`}>✅</div>,
  };
  return icons[iconName] || icons.CheckCircle;
};

const SectionRenderer = ({ section, isDragMode = false }: { section: any; isDragMode?: boolean }) => {
  const { theme } = useStore();
  
  const sectionStyle = {
    '--brand-color': theme.brandColor,
  } as React.CSSProperties;

  switch (section.type) {
    case 'hero':
      return (
        <div className="relative bg-gradient-to-br from-primary/10 to-purple-100 dark:from-primary/20 dark:to-purple-900/20 py-20 px-6" style={sectionStyle}>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {section.content.headline}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {section.content.subhead}
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90" style={{ backgroundColor: theme.brandColor }}>
              Get Started
            </Button>
          </div>
        </div>
      );

    case 'about':
      return (
        <div className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">{section.content.title}</h2>
            <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
              {section.content.content}
            </p>
          </div>
        </div>
      );

    case 'features':
      return (
        <div className="py-16 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.content.map((feature: any) => {
                const IconComponent = getIconComponent(feature.icon);
                return (
                  <Card key={feature.id} className="p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="mb-4 flex justify-center">
                      <IconComponent className="w-12 h-12" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      );

    case 'testimonials':
      return (
        <div className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {section.content.map((testimonial: any) => (
                <Card key={testimonial.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      );

    case 'custom':
      return (
        <div className="py-16 px-6 bg-muted/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">{section.content.title}</h2>
            <p className="text-lg text-muted-foreground">{section.content.content}</p>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export const LivePreview = () => {
  const { 
    sections, 
    previewMode, 
    theme, 
    setPreviewMode, 
    updateTheme, 
    updateSections,
    generatedContent 
  } = useStore();

  const [isDragMode, setIsDragMode] = React.useState(false);

  const previewSizes = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]'
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    updateSections(updatedItems);
  };

  if (!generatedContent) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-lg mb-4 mx-auto flex items-center justify-center">
            <Monitor className="w-8 h-8" />
          </div>
          <p>Complete the form to see your landing page preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Preview Controls */}
      <div className="border-b p-4 bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDragMode(!isDragMode)}
            >
              <GripVertical className="w-4 h-4" />
              {isDragMode ? 'Exit Reorder' : 'Reorder'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateTheme({ mode: theme.mode === 'light' ? 'dark' : 'light' })}
            >
              {theme.mode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto bg-muted/30 p-4">
        <div className={`mx-auto transition-all duration-300 ${previewSizes[previewMode]} max-w-full`}>
          <div className={`bg-background rounded-lg shadow-lg overflow-hidden min-h-[600px] ${theme.mode === 'dark' ? 'dark' : ''}`}>
            {isDragMode ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {sections.map((section, index) => (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`relative group ${snapshot.isDragging ? 'z-50' : ''}`}
                            >
                              <div
                                {...(provided.dragHandleProps || {})}
                                className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
                              >
                                <GripVertical className="w-4 h-4" />
                              </div>
                              <SectionRenderer section={section} isDragMode={true} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div>
                {sections.map((section) => (
                  <SectionRenderer key={section.id} section={section} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
