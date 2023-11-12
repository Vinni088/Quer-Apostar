import supertest from "supertest";
import app from "../../src/app";
import prisma from "../../src/database";

const api = supertest(app);

beforeEach(async () => {
  await prisma.news.deleteMany();
});

describe("News API Tests", () => {
  it("should return 200 on health status", async () => {
    const result = await api.get("/health");
    expect(result.status).toBe(200);
  });

  it("should get all news", async () => {
    await prisma.news.create({
      data: {
        author: "test",
        title: "test",
        text: "test",
      }
    });

    const result = await api.get("/news");
    const news = result.body;
    expect(news).toHaveLength(1);
    expect(news[0]).toEqual({
      id: expect.any(Number),
      author: "test",
      text: "test",
      title: "test",
      firstHand: false,
      createAt: expect.any(String)
    });
  });

  it("should get a specific news", async () => {
    const firstNews = await prisma.news.create({
      data: {
        author: "test",
        title: "test",
        text: "test",
        firstHand: true
      }
    });

    const secondNews = await prisma.news.create({
      data: {
        author: "test2",
        title: "test2",
        text: "test2",
        firstHand: false
      }
    });

    const { body, status } = await api.get(`/news/${firstNews.id}`);
    expect(status).toBe(200);
    expect(body).toEqual({ ...firstNews, createAt: firstNews.createAt.toISOString() });
  });

  it("should create a news", async () => {
    const { body, status } = await api.post("/news").send({
      author: "test",
      title: "test",
      text: "test"
    });

    expect(status).toBe(201);
    expect(body).toEqual({
      id: expect.any(Number),
      author: "test",
      text: "test",
      title: "test",
      firstHand: false,
      createAt: expect.any(String)
    });
  });

  it("should delete a specific news", async () => {
    const firstNews = await prisma.news.create({
      data: {
        author: "test",
        title: "test",
        text: "test",
        firstHand: true
      }
    });

    const secondNews = await prisma.news.create({
      data: {
        author: "test2",
        title: "test2",
        text: "test2",
        firstHand: false
      }
    });

    const { body, status } = await api.delete(`/news/${firstNews.id}`);
    expect(status).toBe(200);
  })

  it("should update a news", async () => {
    const news = await prisma.news.create({
      data: {
        author: "test",
        title: "test",
        text: "test",
      }
    });

    const { body, status } = await api.put(`/news/${news.id}`).send({
      author: "test 2",
      title: "test 2",
      text: "test 2",
    });

    expect(status).toBe(200);
    expect(body).toEqual({
      id: expect.any(Number),
      author: "test 2",
      text: "test 2",
      title: "test 2",
      firstHand: false,
      createAt: news.createAt.toISOString()
    });
  })

})