import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Shield, Zap } from 'lucide-react'

export const metadata = {
  title: 'About Us - TechHive',
  description: 'Learn about TechHive, your ultimate tech community hub for sharing knowledge and connecting with tech enthusiasts.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About TechHive</h1>
          <p className="text-xl text-muted-foreground">
            Your Ultimate Tech Community Hub
          </p>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-lg leading-relaxed">
            TechHive is a vibrant community of tech enthusiasts, developers, and learners 
            dedicated to sharing knowledge and growing together. Founded with the vision of 
            creating a platform where tech professionals and enthusiasts from around the world can 
            connect, learn, and share their expertise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Community Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Built by the community, for the community. Every member contributes to 
                making TechHive a better place to learn and share.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Knowledge Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                From beginners to experts, everyone has something to teach and learn. 
                Share your tricks, tips, and tutorials with thousands of members.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Safe & Moderated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our dedicated team of moderators ensures a safe, respectful environment 
                where quality content thrives and spam is kept at bay.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Fast & Modern</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Built with cutting-edge technology to provide a lightning-fast, smooth 
                experience on both mobile and desktop devices.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              To empower the global tech community by providing a platform where 
              knowledge flows freely, connections are made, and innovation thrives. 
              We believe that together, we can build a stronger, more knowledgeable 
              tech ecosystem for everyone.
            </p>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
          <p className="text-muted-foreground mb-6">
            Whether you're a seasoned developer or just starting your tech journey, 
            there's a place for you at TechHive.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/signup"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Explore Posts
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
