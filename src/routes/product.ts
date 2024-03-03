import { FastifyInstance } from "fastify"
import { undefined, z } from "zod"

import { prisma } from "../lib/prisma"
import { IProduct } from "../@types/product"

export async function productRoutes(app: FastifyInstance) {
    // app.addHook('preHandler', async (request) => {
    //     await request.jwtVerify()
    // })

    app.get('/products', async (request): Promise<(IProduct & { quantity: number })[]> => {
        const products = await prisma.product.findMany({
            include: {
                ProductVariant: {
                    select: {
                        id: true,
                        label: true,
                        quantity: true
                    }
                },
            }
        })
        

        return products.map(({ProductVariant, ...p}) => {
            return {
                ...p,
                quantity: ProductVariant.reduce((acc, v) => acc + v.quantity, 0),
                variants: ProductVariant
            }
        })
    })

    // app.get('/product/:id', async (request, reply) => {
    //     const paramSchema = z.object({
    //         id: z.string().uuid()
    //     })
    //     const { id } = paramSchema.parse(request.params);

    //     const product = await prisma.product.findUniqueOrThrow({
    //         where: {
    //             id,
    //         }
    //     })

    //     if (!product.isPublic && product.userId !== request.user.sub) {
    //         return reply.status(401).send()
    //     }

    //     return product
    // })

    app.post('/product', async (request) => {
        const bodySchema = z.object({
            label: z.string(),
            coverUrl: z.string().url(),
            isEPI: z.coerce.boolean(),
            unitOfMeasurement: z.enum(["UNIT", "PAIR", "PACKAGE"]),
            unitPerPackage: z.number().optional(),
            variants: z.array(z.object({
                label: z.string(),
                quantity: z.number()
            }))
        })
        const { variants, ...productInfo } = bodySchema.parse(request.body);

        const product = await prisma.product.create({
            data: {
                ...productInfo,
                ProductVariant: {
                    createMany: {
                        data: variants
                    }
                }
            },
            include: {
                ProductVariant: true
            }
        })

        return product
    })

    // app.put('/product/:id', async (request, reply) => {
    //     const paramSchema = z.object({
    //         id: z.string().uuid()
    //     })
    //     const { id } = paramSchema.parse(request.params);

    //     const bodySchema = z.object({
    //         content: z.string(),
    //         coverUrl: z.string(),
    //         isPublic: z.coerce.boolean().default(false),
    //     })
    //     const { content, coverUrl, isPublic } = bodySchema.parse(request.body);

    //     let product = await prisma.product.findUniqueOrThrow({
    //         where: {
    //             id,
    //         }
    //     })

    //     if (product.userId !== request.user.sub) {
    //         return reply.status(401).send()
    //     }

    //     product = await prisma.product.update({
    //         where: {
    //             id
    //         },
    //         data: {
    //             content,
    //             coverUrl,
    //             isPublic,
    //         }
    //     })

    //     return product
    // })

    // app.delete('/product/:id', async (request, reply) => {
    //     const paramSchema = z.object({
    //         id: z.string().uuid()
    //     })
    //     const { id } = paramSchema.parse(request.params);

    //     const product = await prisma.product.findUniqueOrThrow({
    //         where: {
    //             id,
    //         }
    //     })

    //     if (product.userId !== request.user.sub) {
    //         return reply.status(401).send()
    //     }

    //     await prisma.product.delete({
    //         where: {
    //             id,
    //         }
    //     })
    // })
}