from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, CheckConstraint, UniqueConstraint
from dbconfig import Base, session, roles


class Company(Base):
    __tablename__ = "company"

    id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)


class Roles(Base):
    __tablename__ = "role"

    id = Column(Integer, autoincrement=True,
                primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)

    __table_args__ = (
        CheckConstraint("name IN ('superadmin', 'admin')",
                        name='name_valid'),
    )


class Users(Base):
    __tablename__ = "user"

    id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    password = Column(String, index=True, nullable=False)
    rol_id = Column(
        Integer,
        ForeignKey('role.id', ondelete='CASCADE'),
        nullable=False
    )
    company_id = Column(
        Integer,
        ForeignKey('company.id', ondelete='CASCADE'),
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint('email', name='email_uniq'),
    )
# Add event listener for table creation/migration
